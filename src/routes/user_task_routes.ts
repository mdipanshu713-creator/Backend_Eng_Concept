
import { Router } from "express";
import { authenticate } from "../middlewares/auth_middleware";
import {
  createUserTask,
  deleteUserTask,
  getUserTasks,
  getUserTasksById,
  updateUserTask,
} from "../services/user_task_service";

export const userTaskRouter = Router();

// Protect every route below this middleware.
userTaskRouter.use(authenticate);

// POST / — Create a task.
userTaskRouter.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;

    // The service validates the title.
    const task = await createUserTask(
      req.user!.userId,
      title
    );

    return res.status(201).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    return next(error);
  }
});

// GET / — Fetch all tasks for the logged-in user.
userTaskRouter.get("/", async (req, res, next) => {
  try {
    const tasks = await getUserTasks(req.user!.userId);

    return res.status(200).json({
      success: true,
      data: { tasks },
    });
  } catch (error) {
    return next(error);
  }
});

// GET /:taskId — Fetch one task owned by the user.
userTaskRouter.get("/:taskId", async (req, res, next) => {
  try {
    const task = await getUserTasksById(
      req.params.taskId,
      req.user!.userId
    );

    return res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    return next(error);
  }
});

// PATCH /:taskId — Partially update a task's title.
userTaskRouter.patch("/:taskId", async (req, res, next) => {
  try {
    const task = await updateUserTask(
      req.params.taskId,
      req.user!.userId,
      req.body.title
    );

    return res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    return next(error);
  }
});



// Delete Task 

userTaskRouter.delete('/:taskId',async(req, res, next) => {
  try {
    await deleteUserTask(req.params.taskId,req.user!.userId)

    res.status(200).json({
      success:true,
      message:'Task deleted successfully from DB'
    })
    
  } catch (error) {
    
  }
})

