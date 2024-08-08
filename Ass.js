const apiUrl = "https://dummy.restapiexample.com/api/v1/employees";
const addUrl = "https://dummy.restapiexample.com/api/v1/create";
const updateUrl = "https://dummy.restapiexample.com/api/v1/update";
const deleteUrl = "https://dummy.restapiexample.com/api/v1/delete";
const employeeList = document.getElementById("employee-list");
const form = document.getElementById("employee-form");
const editForm = document.getElementById("edit-form-container");
const editNameInput = document.getElementById("edit-name");
const editSalaryInput = document.getElementById("edit-salary");
const updateButton = document.getElementById("update-button");
const cancelButton = document.getElementById("cancel-button");

let editingEmployeeId = null;

const fetchEmployees = async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    renderEmployees(data.data);
  } catch (error) {
    console.error("Error fetching employees:", error);
    alert(`Error fetching employees: Error 429 (Too Many Requests)`);
  }
};

const renderEmployees = (employees) => {
  employeeList.innerHTML = "";
  employees.forEach((employee) => {
    const div = document.createElement("div");
    div.className = "employee-item";
    div.innerHTML = `
      <p> ${employee.employee_name}</p>
      <p> ${employee.employee_salary}</p>
      <button onclick="startEdit(${employee.id}, '${employee.employee_name}', '${employee.employee_salary}')">Edit</button>
      <button onclick="deleteEmployee(${employee.id})">Delete</button>
    `;
    employeeList.appendChild(div);
  });
};

const addEmployee = async (name, salary) => {
  try {
    const response = await fetch(addUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, salary }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Employee added:", data);
    fetchEmployees();
  } catch (error) {
    console.error("Error adding employee:", error);
    alert(`Error fetching employees: Error 429 (Too Many Requests)`);
  }
};

const updateEmployee = async (id, name, salary) => {
  try {
    const response = await fetch(`${updateUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, salary }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Employee updated:", data);
    fetchEmployees();
    cancelEdit();
  } catch (error) {
    console.error("Error updating employee:", error);
    alert(`Error fetching employees: Error 429 (Too Many Requests)`);
  }
};

const deleteEmployee = async (id) => {
  try {
    const response = await fetch(`${deleteUrl}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Employee deleted:", data);
    fetchEmployees();
  } catch (error) {
    console.error("Error deleting employee:", error);
    alert(`Error fetching employees: Error 429 (Too Many Requests)`);
  }
};

const startEdit = (id, name, salary) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  editingEmployeeId = id;
  editNameInput.value = name;
  editSalaryInput.value = salary;
  editForm.style.display = "block";
};

const cancelEdit = () => {
  editForm.style.display = "none";
  editingEmployeeId = null;
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const salary = document.getElementById("salary").value;
  addEmployee(name, salary);
  form.reset();
});

updateButton.addEventListener("click", () => {
  const name = editNameInput.value;
  const salary = editSalaryInput.value;
  if (editingEmployeeId) {
    updateEmployee(editingEmployeeId, name, salary);
  }
});

cancelButton.addEventListener("click", cancelEdit);

// Initial fetch
fetchEmployees();
