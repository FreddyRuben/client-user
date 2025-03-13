import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms'

@Component({
  selector: 'app-users',
  imports: [HttpClientModule, NgForOf, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  updateForm: FormGroup;
  createForm: FormGroup;
  selectedUserId: String | null = null

  constructor(private http: HttpClient, private fb: FormBuilder){
    this.updateForm = this.fb.group({
      user_name: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]]
    });

    this.createForm = this.fb.group({
      user_name: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators. required],
      age: ['', Validators.required]
    });
  }

  ngOnInit(): void{
    this.getUsers();
  }
  
  getUsers(){
    this.http.get<any[]>('http://localhost:3000/api/').subscribe(data => {
      this.users = data;
    });
  }

  selectUser(user:any): void {
    this.selectedUserId = user._id;
    this.updateForm.patchValue({
      user_name: user.user_name,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age
    });
  }

  updateUser(): void {
    if (this.selectedUserId && this.updateForm.valid) {
      const updatedUser = this.updateForm.value;
      this.http.put(`http://localhost:3000/api/${this.selectedUserId}`, updatedUser)
        .subscribe(() => {
          this.getUsers(); // Recarga los usuarios
          this.selectedUserId = null;
          this.updateForm.reset(); // Limpia el formulario
        }, error => {
          console.error('Error updating user:', error);
        });
    }
  }

  createUser(): void{
    if (this.createForm.valid) {
      const newUser = this.createForm.value;
      this.http.post('http://localhost:3000/api/', newUser)
        .subscribe(() => {
          this.getUsers();
          this.createForm.reset();
        }, error => {
          console.error('Error creating user:', error);
        });
    }
  }

  deleteUser(userId: string): void { // Nuevo método para eliminar usuarios
    this.http.delete(`http://localhost:3000/api/${userId}`)
      .subscribe(() => {
        this.getUsers(); // Recarga los usuarios después de la eliminación
      }, error => {
        console.error('Error deleting user:', error);
      });
  }

  cancelUpdate(): void {
    this.selectedUserId = null;
    this.updateForm.reset();
  }
}