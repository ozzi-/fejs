// here you can define your functions

function listEmployees(employees){
        var rowClickFunc = function(e, id, data, row){
                var id = id._row.data.id;
                window.location.href='index.html?page=employee&id='+id;
        }
        var table = new Tabulator("#employees", {
            layout:"fitDataFill",
            layoutColumnsOnNewData:true,
            columns:[
                {title:"Name", field:"employee_name"},
                {title:"Age", field:"employee_age"},
            ],
            rowClick:rowClickFunc,
        });
        table.setData(employees);
}

function showEmployee(employee){
        document.getElementById("name").value=employee.employee_name;
        document.getElementById("age").value=employee.employee_age;
        document.getElementById("salary").value=employee.employee_salary;
        document.getElementById("photo").src=employee.profile_image;
}
