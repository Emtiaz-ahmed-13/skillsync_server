import { Project } from "../models/project.model";
import { Sprint } from "../models/sprint.model";
import { Task } from "../models/task.model";
import ApiError from "../utils/ApiError";

/**
 * Save sprints to DB
 */
const generateAiSprintPlan = async (projectId: string, method: "auto" | "manual" = "manual") => {
  // Get project details
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  return {
    sprints: [
      {
        title: "Sprint 1: Planning",
        description: "Initial project planning and setup",
        features: [],
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: "planning",
      },
      {
        title: "Sprint 2: Development",
        description: "Core development work",
        features: [],
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), 
        status: "planning",
      },
      {
        title: "Sprint 3: Testing",
        description: "Testing and finalization",
        features: [],
        startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), 
        status: "planning",
      },
    ],
    tasks: [],
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
    .populate("sprintId", "name")
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
