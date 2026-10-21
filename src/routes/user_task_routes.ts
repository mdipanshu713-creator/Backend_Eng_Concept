
import { Router } from "express";
import { authenticate } from "../middlewares/auth_middleware";
<<<<<<< HEAD
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
=======
import { createUserTask } from "../services/user_task_service";

export const userTaskRouter = Router();

// Protect all routes registered below this middleware.
userTaskRouter.use(authenticate);

// Create a new task for the authenticated user.
>>>>>>> cc85c28 (Implement user task listing and creation)
userTaskRouter.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;

<<<<<<< HEAD
    // The service validates the title.
    const task = await createUserTask(
      req.user!.userId,
      title
=======
    // Validate the task title.
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid task title is required",
      });
    }

    // Create the task using the authenticated user's ID.
    const task = await createUserTask(
      req.user!.userId,
      title.trim()
>>>>>>> cc85c28 (Implement user task listing and creation)
    );

    return res.status(201).json({
      success: true,
<<<<<<< HEAD
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

=======
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
});
>>>>>>> cc85c28 (Implement user task listing and creation)
