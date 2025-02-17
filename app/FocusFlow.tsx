"use client";
import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Bell, ChevronLeft, ChevronRight } from "lucide-react";

// Type Definitions
interface Thought {
  id: number;
  content: string;
  timestamp: string;
}

interface Task {
  id: number;
  content: string;
  time: string;
  date: string;
  completed: boolean;
}

interface ThoughtsMap {
  [date: string]: Thought[];
}

interface DailyThoughtsProps {
  thoughts: ThoughtsMap;
  currentDate: string;
  onAddThought: (thought: string) => void;
  onDateChange: (offset: number) => void;
}

interface TasksRemindersProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id" | "completed">) => void;
  onToggleTask: (taskId: number) => void;
}

// Daily Thoughts Component
const DailyThoughts: React.FC<DailyThoughtsProps> = ({
  thoughts,
  currentDate,
  onAddThought,
  onDateChange,
}) => {
  const [newThought, setNewThought] = useState<string>("");
  const thoughtsContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (thoughtsContainerRef.current) {
      const container = thoughtsContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [thoughts[currentDate]]);

  const handleAddThought = () => {
    if (newThought.trim()) {
      onAddThought(newThought);
      setNewThought("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddThought();
    }
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Daily Thoughts</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDateChange(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2">
            {new Date(currentDate).toLocaleDateString("en-US", {
              month: "numeric",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Button variant="outline" size="icon" onClick={() => onDateChange(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={thoughtsContainerRef}
        className="h-[400px] overflow-y-auto mb-4"
      >
        <div className="space-y-1">
          {(thoughts[currentDate] || []).map((thought: Thought) => (
            <div key={thought.id} className="p-2 rounded-lg bg-white/60">
              <span className="text-sm text-gray-500 mr-2">
                {thought.timestamp}
              </span>
              <div className="text-gray-700">{thought.content}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <Input
          value={newThought}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewThought(e.target.value)
          }
          placeholder="Write your thoughts..."
          className="flex-1"
          onKeyPress={handleKeyPress}
        />
        <Button onClick={handleAddThought} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

// Tasks Component
const TasksReminders: React.FC<TasksRemindersProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
}) => {
  const defaultTask = { content: "", time: "", date: "" };
  const [newTask, setNewTask] = useState(defaultTask);

  const handleAddTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTask.content.trim() && newTask.time && newTask.date) {
      onAddTask(newTask);
      setNewTask(defaultTask);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm flex flex-col mt-6">
      <h2 className="text-xl font-medium mb-4">Tasks & Reminders</h2>

      <form onSubmit={handleAddTask} className="space-y-2 mb-4">
        <Input
          name="content"
          value={newTask.content}
          onChange={handleInputChange}
          placeholder="New task..."
          className="w-full"
        />
        <div className="flex gap-2">
          <Input
            name="date"
            type="date"
            value={newTask.date}
            onChange={handleInputChange}
            className="w-1/2"
          />
          <Input
            name="time"
            type="time"
            value={newTask.time}
            onChange={handleInputChange}
            className="w-1/2"
          />
        </div>
        <Button type="submit" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </form>

      <div className="h-[300px] overflow-y-auto space-y-2">
        {tasks
          .sort(
            (a, b) =>
              new Date(`${a.date} ${a.time}`).getTime() -
              new Date(`${b.date} ${b.time}`).getTime(),
          )
          .map((task) => (
            <div
              key={task.id}
              className={`p-3 rounded-lg flex items-center gap-2 cursor-pointer ${
                task.completed ? "bg-gray-100" : "bg-white/60"
              }`}
              onClick={() => onToggleTask(task.id)}
            >
              <Bell className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <div
                  className={`${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}
                >
                  {task.content}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(`${task.date} ${task.time}`).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
};

// Main App Component
const FocusFlow: React.FC = () => {
  const [thoughts, setThoughts] = useState<ThoughtsMap>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const Logo: React.FC = () => (
    <div className="relative w-12 h-12">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="auraGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE5E5" />
            <stop offset="25%" stopColor="#FFE8D6" />
            <stop offset="50%" stopColor="#E8F4D9" />
            <stop offset="75%" stopColor="#D6E8F0" />
            <stop offset="100%" stopColor="#E5E5FF" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#auraGradient)" />
      </svg>
    </div>
  );

  useEffect(() => {
    const savedThoughts = localStorage.getItem("thoughts");
    const savedTasks = localStorage.getItem("tasks");
    if (savedThoughts) {
      try {
        setThoughts(JSON.parse(savedThoughts));
      } catch (error) {
        console.error("Error parsing saved thoughts:", error);
        setThoughts({});
      }
    }
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Error parsing saved tasks:", error);
        setTasks([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("thoughts", JSON.stringify(thoughts));
  }, [thoughts]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addThought = (content: string) => {
    setThoughts((prev) => ({
      ...prev,
      [currentDate]: [
        ...(prev[currentDate] || []),
        {
          content,
          timestamp: new Date().toLocaleTimeString(),
          id: Date.now(),
        },
      ],
    }));
  };

  const addTask = (newTask: Omit<Task, "id" | "completed">) => {
    setTasks((prev) => [
      ...prev,
      { ...newTask, id: Date.now(), completed: false },
    ]);
  };

  const toggleTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const changeDate = (offset: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + offset);
    setCurrentDate(date.toISOString().split("T")[0]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now
        .toLocaleTimeString("en-US", { hour12: false })
        .slice(0, 5);
      const currentDateStr = now.toISOString().split("T")[0];

      tasks.forEach((task) => {
        if (
          task.date === currentDateStr &&
          task.time === currentTime &&
          !task.completed
        ) {
          window.alert(`Reminder: ${task.content}`);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Logo />
          <h1 className="text-3xl font-semibold text-gray-800">FocusFlow</h1>
        </div>

        <DailyThoughts
          thoughts={thoughts}
          currentDate={currentDate}
          onAddThought={addThought}
          onDateChange={changeDate}
        />

        <TasksReminders
          tasks={tasks}
          onAddTask={addTask}
          onToggleTask={toggleTask}
        />
      </div>
    </div>
  );
};

export default FocusFlow;
