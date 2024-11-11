document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('studentForm');
    const studentList = document.getElementById('studentList');
    let editMode = false; // To track if we're editing a student
    let editStudentIndex = null; // Store index of student being edited

    if (!studentList) {
        console.error("Element with id 'studentList' not found in the HTML.");
        return;
    }

    // Load students from localStorage when the page loads
    loadStudents();

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('sname').value.trim();
        const id = document.getElementById('sid').value.trim();
        const studentClass = document.getElementById('sclass').value.trim();
        const contact = document.getElementById('contact').value.trim();
        const email = document.getElementById('email').value.trim();

        if (name && id && studentClass && email && contact) {
            const student = { name, id, studentClass, contact, email };

            if (editMode) {
                updateStudent(student);
            } else {
                addStudent(student);
            }

            form.reset(); // Reset form fields
            editMode = false; // Exit edit mode
            form.querySelector('button[type="submit"]').textContent = "Submit";
        } else {
            alert("Please fill all fields.");
        }
    });

    function addStudent(student) {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
        displayStudent(student, students.length - 1);
    }

    function loadStudents() {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        studentList.innerHTML = ''; // Clear existing list

        students.forEach((student, index) => displayStudent(student, index));
    }

    function displayStudent(student, index) {
        const studentRow = document.createElement('div');
        studentRow.classList.add('register-student-list');

        studentRow.innerHTML = `
            <div class="row-data">${student.name}</div>
            <div class="row-data">${student.id}</div>
            <div class="row-data">${student.studentClass}</div>
            <div class="row-data email-column">${student.contact}</div>
            <div class="row-data email-column">${student.email}</div>
            <div class="actions row-data"> <div class="del-button"><button class="delete-btn"><i class="fa-solid fa-trash"></i> Delete</button></div>
            <div class="edit-button"><button class="edit-btn"><i class="fa-regular fa-pen-to-square"></i> Edit</button></div> </div>
        `;

        studentList.appendChild(studentRow);

        // Delete functionality
        studentRow.querySelector('.delete-btn').addEventListener('click', function() {
            deleteStudent(index);
            studentRow.remove();
        });

        // Edit functionality
        studentRow.querySelector('.edit-btn').addEventListener('click', function() {
            enterEditMode(student, index);
        });
    }

    function deleteStudent(index) {
        const students = JSON.parse(localStorage.getItem('students')) || [];    
        students.splice(index, 1); // Remove student at given index
        localStorage.setItem('students', JSON.stringify(students));
    }

    function enterEditMode(student, index) {
        document.getElementById('sname').value = student.name;
        document.getElementById('sid').value = student.id;
        document.getElementById('sclass').value = student.studentClass;
        document.getElementById('contact').value= student.contact;
        document.getElementById('email').value = student.email;

        editMode = true;
        editStudentIndex = index;
        form.querySelector('button[type="submit"]').textContent = "Update";
    }

    function updateStudent(updatedStudent) {
        const students = JSON.parse(localStorage.getItem('students')) || [];

        if (editStudentIndex !== null && students[editStudentIndex]) {
            students[editStudentIndex] = updatedStudent;
            localStorage.setItem('students', JSON.stringify(students));

            // Refresh list to reflect changes
            loadStudents();
        }
    }
});
