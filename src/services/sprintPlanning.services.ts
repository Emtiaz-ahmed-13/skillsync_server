import { Project } from "../models/project.model";
import { Sprint } from "../models/sprint.model";
import { Task } from "../models/task.model";
import { AiServices } from "./ai.services";
import ApiError from "../utils/ApiError";

const generateAiSprintPlan = async (projectId: string, method: "auto" | "manual" = "auto") => {
  // Get project details
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // If manual method is selected, return a default structure for manual editing
  if (method === "manual") {
    return {
      sprints: [
        {
          name: "Sprint 1: ",
          description: "Description for sprint 1",
          startDate: new Date(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        },
        {
          name: "Sprint 2: ",
          description: "Description for sprint 2",
          startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 4 weeks from now
        },
        {
          name: "Sprint 3: ",
          description: "Description for sprint 3",
          startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // 6 weeks from now
        }
      ],
      tasks: []
    };
  }

  // Auto method - use AI to generate the plan
  const aiResponse = await AiServices.analyzeProjectAndGenerateTasks(
    projectId,
    project.description,
    project.title
  );

  // Calculate dates for sprints (assuming 2 weeks per sprint)
  const startDate = new Date();
  const sprints = aiResponse.sprints.map((sprint: any, index: number) => ({
    ...sprint,
    startDate: new Date(startDate.getTime() + index * 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(startDate.getTime() + (index + 1) * 14 * 24 * 60 * 60 * 1000),
  }));

  return {
    sprints,
    tasks: aiResponse.tasks
  };
};

const saveSprintPlan = async (projectId: string, sprintData: any[]) => {
  // Delete existing sprints and tasks for this project
  await Sprint.deleteMany({ projectId });
  await Task.deleteMany({ projectId });

  // Create new sprints and collect their IDs
  const sprintMap: Record<string, string> = {};
  const createdSprints = [];

  for (const sprintInfo of sprintData) {
    const sprintPayload = {
      ...sprintInfo,
      projectId,
    };

    const sprint = await Sprint.create(sprintPayload);
    sprintMap[sprintInfo.name] = sprint._id.toString();
    createdSprints.push({
      ...sprint.toObject(),
      id: sprint._id.toString(),
    });
  }

  return createdSprints;
};

const saveTasksForSprintPlan = async (projectId: string, taskData: any[], sprintMap: Record<string, string>) => {
  const tasksToCreate = taskData.map(task => ({
    ...task,
    projectId,
    sprintId: sprintMap[task.sprint] || null, // Map sprint name to sprint ID
  }));

  const tasks = await Task.insertMany(tasksToCreate);
  
  return tasks.map(task => ({
    ...task.toObject(),
    id: task._id.toString(),
  }));
};

const createSprintPlan = async (projectId: string, method: "auto" | "manual" = "auto", customData?: any) => {
  let sprintPlan;

  if (method === "manual" && customData) {
    // Use custom data for manual method
    sprintPlan = customData;
  } else {
    // Generate plan using AI or default structure
    sprintPlan = await generateAiSprintPlan(projectId, method);
  }

  // Save sprints
  const createdSprints = await saveSprintPlan(projectId, sprintPlan.sprints);

  // Create a map of sprint names to IDs for task assignment
  const sprintMap: Record<string, string> = {};
  createdSprints.forEach(sprint => {
    // Extract sprint number from name (e.g., "Sprint 1: Foundation" -> "Sprint 1")
    const sprintNameMatch = sprint.name.match(/^(Sprint \d+)/);
    if (sprintNameMatch) {
      sprintMap[sprintNameMatch[1]] = sprint.id;
    }
  });

  // Save tasks
  const createdTasks = await saveTasksForSprintPlan(projectId, sprintPlan.tasks, sprintMap);

  return {
    sprints: createdSprints,
    tasks: createdTasks
  };
};

const getSprintPlan = async (projectId: string) => {
  // Get all sprints for the project
  const sprints = await Sprint.find({ projectId })
    .sort({ startDate: 1 })
    .lean();

  // Get all tasks for the project
  const tasks = await Task.find({ projectId })
    .populate("sprintId", "name")
    .sort({ createdAt: 1 })
    .lean();

  return {
    sprints: sprints.map(sprint => ({
      ...sprint,
      id: sprint._id.toString(),
    })),
    tasks: tasks.map(task => ({
      ...task,
      id: task._id.toString(),
    }))
  };
};

export const SprintPlanningServices = {
  createSprintPlan,
  getSprintPlan,
  generateAiSprintPlan,
};