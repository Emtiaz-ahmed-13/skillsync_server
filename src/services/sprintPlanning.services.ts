import { Project } from "../models/project.model";
import { Sprint } from "../models/sprint.model";
import { Task } from "../models/task.model";
import ApiError from "../utils/ApiError";
import { generateGroqCompletion, parseJsonFromAI } from "../utils/groq.utils";

interface SprintPlanResult {
  sprints: Array<{
    title: string;
    description: string;
    features: Array<{ id: string; title: string; description: string; status: string }>;
    startDate: string | Date;
    endDate: string | Date;
    status: string;
  }>;
  tasks: Array<{
    title: string;
    description?: string;
    sprint: string;
    status?: string;
    priority?: string;
  }>;
}

const generateAiSprintPlan = async (
  projectId: string,
  method: "auto" | "manual" = "auto",
): Promise<SprintPlanResult> => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (method === "manual") {
    const now = Date.now();
    return {
      sprints: [
        {
          title: "Sprint 1: Planning",
          description: "Initial project planning and setup",
          features: [],
          startDate: new Date(now),
          endDate: new Date(now + 14 * 24 * 60 * 60 * 1000),
          status: "planning",
        },
        {
          title: "Sprint 2: Development",
          description: "Core development work",
          features: [],
          startDate: new Date(now + 14 * 24 * 60 * 60 * 1000),
          endDate: new Date(now + 28 * 24 * 60 * 60 * 1000),
          status: "planning",
        },
        {
          title: "Sprint 3: Testing",
          description: "Testing and finalization",
          features: [],
          startDate: new Date(now + 28 * 24 * 60 * 60 * 1000),
          endDate: new Date(now + 42 * 24 * 60 * 60 * 1000),
          status: "planning",
        },
      ],
      tasks: [],
    };
  }

  const prompt = `You are an expert agile project manager. Create a sprint plan for this project.

PROJECT:
Title: ${project.title}
Description: ${project.description}
Budget: $${project.budget}
Technologies: ${project.technology.join(", ")}

Respond ONLY with valid JSON (no markdown):
{
  "sprints": [
    {
      "title": "Sprint 1: ...",
      "description": "...",
      "features": [{"id": "f1", "title": "...", "description": "...", "status": "pending"}],
      "startDate": "2026-07-01T00:00:00.000Z",
      "endDate": "2026-07-14T00:00:00.000Z",
      "status": "planning"
    }
  ],
  "tasks": [
    {
      "title": "Task title",
      "description": "Task details",
      "sprint": "Sprint 1: ...",
      "status": "todo",
      "priority": "medium"
    }
  ]
}

Create 3-4 sprints with realistic dates starting from today. Include 2-4 tasks per sprint.`;

  const text = await generateGroqCompletion(prompt);
  const plan = parseJsonFromAI<SprintPlanResult>(text);

  if (!Array.isArray(plan.sprints) || plan.sprints.length === 0) {
    throw new ApiError(500, "Invalid sprint plan from AI");
  }

  return {
    sprints: plan.sprints,
    tasks: plan.tasks || [],
  };
};

const saveSprintPlan = async (projectId: string, sprintData: any[]) => {
  await Sprint.deleteMany({ projectId });
  await Task.deleteMany({ projectId });

  const createdSprints: any[] = [];
  const sprintMap: Record<string, string> = {};

  for (const sprintInfo of sprintData) {
    const sprintPayload = { ...sprintInfo, projectId };
    const sprint = await Sprint.create(sprintPayload);
    sprintMap[sprintInfo.title] = sprint._id.toString();
    createdSprints.push({ ...sprint.toObject(), id: sprint._id.toString() });
  }

  return { createdSprints, sprintMap };
};

const saveTasksForSprintPlan = async (
  projectId: string,
  taskData: any[],
  sprintMap: Record<string, string>,
) => {
  const tasksToCreate = taskData.map((task) => ({
    ...task,
    projectId,
    sprintId: sprintMap[task.sprint] || null,
  }));

  const tasks = await Task.insertMany(tasksToCreate);
  return tasks.map((task) => ({ ...task.toObject(), id: task._id.toString() }));
};

const createSprintPlan = async (
  projectId: string,
  customData: { sprints: any[]; tasks: any[] },
) => {
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (!customData || !customData.sprints?.length) {
    throw new ApiError(400, "No sprint data provided");
  }
  const { createdSprints, sprintMap } = await saveSprintPlan(projectId, customData.sprints);
  const createdTasks = await saveTasksForSprintPlan(projectId, customData.tasks || [], sprintMap);
  return {
    sprints: createdSprints,
    tasks: createdTasks,
  };
};

const getSprintPlan = async (projectId: string) => {
  const sprints = await Sprint.find({ projectId }).sort({ startDate: 1 }).lean();
  const tasks = await Task.find({ projectId })
    .populate("sprintId", "title")
    .sort({ createdAt: 1 })
    .lean();

  return {
    sprints: sprints.map((s) => ({ ...s, id: s._id.toString() })),
    tasks: tasks.map((t) => ({ ...t, id: t._id.toString() })),
  };
};

export const SprintPlanningServices = {
  createSprintPlan,
  getSprintPlan,
  generateAiSprintPlan,
};
