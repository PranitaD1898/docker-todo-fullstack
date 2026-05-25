import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService, Todo } from './services/todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  todos: Todo[] = [];
  newTodo: Todo = { title: '', description: '', completed: false };

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe({
      next: (data) => this.todos = data,
      error: (err) => console.error('Error loading todos:', err)
    });
  }

  addTodo() {
    if (this.newTodo.title.trim()) {
      this.todoService.createTodo(this.newTodo).subscribe({
        next: (todo) => {
          this.todos.push(todo);
          this.newTodo = { title: '', description: '', completed: false };
        },
        error: (err) => console.error('Error creating todo:', err)
      });
    }
  }

  toggleComplete(todo: Todo) {
    todo.completed = !todo.completed;
    this.todoService.updateTodo(todo._id!, todo).subscribe({
      error: (err) => console.error('Error updating todo:', err)
    });
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => this.todos = this.todos.filter(t => t._id !== id),
      error: (err) => console.error('Error deleting todo:', err)
    });
  }
}