export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    userId: string
    createdAt: Date
    updatedAt: Date
}

export interface CreateTodo {
    title: string;
    userId: string;
}