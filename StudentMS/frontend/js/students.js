// js/students.js

(function () {

    const DEFAULT_AVATAR =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%232563EB'/%3E%3Ctext x='50' y='65' font-size='50' text-anchor='middle' fill='white'%3E👤%3C/text%3E%3C/svg%3E";


    let students = [];
    let currentPage = 1;
    const rowsPerPage = 5;
    let deleteId = null;



    // ==============================
    // LOAD STUDENTS FROM DATABASE
    // ==============================

    async function loadStudents() {

        try {

            showLoader();

            const response = await getStudents();

            students = response.data || [];

            renderStudents();

        }

        catch (error) {

            console.error(error);

            alert("Failed to load students.");

        }

        finally {

            hideLoader();

        }

    }





    // ==============================
    // RENDER TABLE
    // ==============================

    function renderStudents() {


        const searchId =
            document.getElementById("searchId").value.toLowerCase();


        const searchFirst =
            document.getElementById("searchFirstName").value.toLowerCase();


        const searchLast =
            document.getElementById("searchLastName").value.toLowerCase();


        const filterDept =
            document.getElementById("filterDept").value;


        const filterGender =
            document.getElementById("filterGender").value;




        const filtered = students.filter(student => {


            return (

                (!searchId ||
                student.studentId.toLowerCase().includes(searchId))


                &&


                (!searchFirst ||
                student.firstName.toLowerCase().includes(searchFirst))


                &&


                (!searchLast ||
                student.lastName.toLowerCase().includes(searchLast))


                &&


                (!filterDept ||
                student.department === filterDept)


                &&


                (!filterGender ||
                student.gender === filterGender)

            );


        });





        const totalPages =
            Math.ceil(filtered.length / rowsPerPage) || 1;



        if(currentPage > totalPages)
            currentPage = totalPages;



        const start =
            (currentPage - 1) * rowsPerPage;



        const pageStudents =
            filtered.slice(start,start + rowsPerPage);





        const tbody =
            document.querySelector("#studentTable tbody");



        tbody.innerHTML = "";



        pageStudents.forEach(student => {


            const photo =
                student.photo || DEFAULT_AVATAR;



            tbody.innerHTML += `

            <tr>


            <td class="avatar-cell">

                <img 
                src="${photo}"
                width="50"
                height="50"
                style="border-radius:50%;object-fit:cover"
                onerror="this.src='${DEFAULT_AVATAR}'">

            </td>



            <td>${student.studentId}</td>


            <td>${student.firstName}</td>


            <td>${student.lastName}</td>


            <td>${student.gender}</td>


            <td>${student.dob}</td>


            <td>${student.department}</td>


            <td>${student.academicYear}</td>



            <td>


                <button 
                class="icon-btn"
                onclick="viewProfile('${student._id}')">
                👁️
                </button>



                <button 
                class="icon-btn"
                onclick="editStudent('${student._id}')">
                ✏️
                </button>



                <button 
                class="icon-btn"
                onclick="confirmDelete('${student._id}')">
                🗑️
                </button>



            </td>



            </tr>

            `;


        });



        updateDepartmentFilter();

        renderPagination(totalPages);


    }





    // ==============================
    // PAGINATION
    // ==============================


    function renderPagination(totalPages){


        const box =
            document.getElementById("pagination");


        box.innerHTML="";



        for(let i=1;i<=totalPages;i++){


            box.innerHTML += `

            <button 
            class="${i===currentPage?'active':''}"
            onclick="goToPage(${i})">

            ${i}

            </button>

            `;

        }

    }



    window.goToPage=function(page){

        currentPage=page;

        renderStudents();

    };





    // ==============================
    // DEPARTMENT FILTER
    // ==============================


    function updateDepartmentFilter(){


        const select =
        document.getElementById("filterDept");


        const current =
        select.value;



        const departments =
        [...new Set(
            students.map(s=>s.department)
        )];



        select.innerHTML =
        `<option value="">All Departments</option>`;



        departments.forEach(dep=>{


            select.innerHTML +=
            `

            <option 
            value="${dep}"
            ${dep===current?"selected":""}>

            ${dep}

            </option>

            `;


        });


    }






    // ==============================
    // SEARCH EVENTS
    // ==============================


    [
        "searchId",
        "searchFirstName",
        "searchLastName",
        "filterDept",
        "filterGender"

    ].forEach(id=>{


        document
        .getElementById(id)
        .addEventListener("input",()=>{

            currentPage=1;

            renderStudents();

        });


    });






    // ==============================
    // ADD STUDENT
    // ==============================


    document
    .getElementById("openAddModal")
    .onclick=function(){


        document.getElementById("studentForm").reset();

        document.getElementById("editIndex").value="";


        openModal("Add Student");


    };






    document
    .getElementById("studentForm")
    .onsubmit=async function(e){


        e.preventDefault();



        const id =
        document.getElementById("editIndex").value;



        const formData =
        new FormData();



        formData.append(
            "studentId",
            studentId.value
        );


        formData.append(
            "firstName",
            firstName.value
        );


        formData.append(
            "lastName",
            lastName.value
        );


        formData.append(
            "gender",
            gender.value
        );


        formData.append(
            "dob",
            dob.value
        );


        formData.append(
            "department",
            department.value
        );


        formData.append(
            "academicYear",
            academicYear.value
        );



        if(photo.files[0]){

            formData.append(
                "photo",
                photo.files[0]
            );

        }



        try{


            if(id===""){


                await addStudent(formData);


            }

            else{


                await updateStudent(id,formData);


            }



            closeModal();


            loadStudents();



        }

        catch(error){

            console.error(error);

            alert("Saving failed");

        }


    };







    // ==============================
    // EDIT STUDENT
    // ==============================


    window.editStudent=async function(id){


        const response =
        await getStudent(id);



        const s=response.data;



        editIndex.value=s._id;

        studentId.value=s.studentId;

        firstName.value=s.firstName;

        lastName.value=s.lastName;

        gender.value=s.gender;

        dob.value=s.dob;

        department.value=s.department;

        academicYear.value=s.academicYear;



        openModal("Update Student");


    };








    // ==============================
    // DELETE
    // ==============================


    window.confirmDelete=function(id){


        deleteId=id;


        document
        .getElementById("deleteModal")
        .classList.add("active");


    };





    document
    .getElementById("confirmDeleteBtn")
    .onclick=async function(){


        if(deleteId){


            await deleteStudent(deleteId);


            closeDeleteModal();


            loadStudents();


        }


    };







    // ==============================
    // PROFILE
    // ==============================


    window.viewProfile=async function(id){


        const response =
        await getStudent(id);



        const s=response.data;



        profileContent.innerHTML=`


        <img 
        src="${s.photo || DEFAULT_AVATAR}"
        width="120"
        height="120"
        style="border-radius:50%">



        <h2>
        ${s.firstName} ${s.lastName}
        </h2>



        <p>ID: ${s.studentId}</p>

        <p>Gender: ${s.gender}</p>

        <p>DOB: ${s.dob}</p>

        <p>Department: ${s.department}</p>

        <p>Year: ${s.academicYear}</p>


        `;



        profileModal.classList.add("active");


    };









    // ==============================
    // MODAL FUNCTIONS
    // ==============================


    function openModal(title){


        modalTitle.innerText=title;


        studentModal.classList.add("active");


    }


    window.closeModal=function(){

        studentModal.classList.remove("active");

        studentForm.reset();

        editIndex.value="";

    };


    window.closeDeleteModal=function(){

        deleteModal.classList.remove("active");

        deleteId=null;

    };


    window.closeProfileModal=function(){

        profileModal.classList.remove("active");

    };






    // ==============================
    // LOADER
    // ==============================


    function showLoader(){

        globalLoader.style.display="flex";

    }


    function hideLoader(){

        globalLoader.style.opacity="0";


        setTimeout(()=>{

            globalLoader.style.display="none";

        },500);

    }






    // START

    window.onload=function(){

        loadStudents();

    };



})();