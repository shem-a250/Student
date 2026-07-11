// js/dashboard.js

(function () {


    let students = [];



    // ==========================
    // LOAD DASHBOARD DATA
    // ==========================

    async function loadDashboard() {

        try {

            showLoader();


            const summaryResponse =
                await getDashboardSummary();



            if(summaryResponse.success){

                const data =
                    summaryResponse.data;


                animateNumber(
                    "totalStudentsCount",
                    data.totalStudents
                );


                animateNumber(
                    "maleCount",
                    data.male
                );


                animateNumber(
                    "femaleCount",
                    data.female
                );


                animateNumber(
                    "departmentCount",
                    data.departments
                );


                animateNumber(
                    "yearCount",
                    data.academicYears
                );


            }



            const studentResponse =
                await getStudents();



            students =
                studentResponse.data || [];



            updateGenderChart();

            updateDeptChart();

            renderRecent();



        }

        catch(error){

            console.error(
                "Dashboard error:",
                error
            );


            alert(
                "Unable to load dashboard data."
            );


        }

        finally{

            hideLoader();

        }


    }







    // ==========================
    // NUMBER ANIMATION
    // ==========================


    function animateNumber(id, final){


        const element =
            document.getElementById(id);



        if(!element)
            return;



        let current =
            Number(element.innerText) || 0;



        const step =
            Math.ceil(
                Math.abs(final-current)/20
            );



        const timer =
            setInterval(()=>{


                if(current < final){

                    current += step;


                    if(current >= final){

                        current = final;

                        clearInterval(timer);

                    }

                }


                else if(current > final){


                    current -= step;


                    if(current <= final){

                        current = final;

                        clearInterval(timer);

                    }


                }

                else{

                    clearInterval(timer);

                }



                element.innerText =
                    current;



            },40);


    }









    // ==========================
    // GENDER BAR CHART
    // ==========================


    function updateGenderChart(){


        const total =
            students.length || 1;



        const male =
            students.filter(
                s=>s.gender==="Male"
            ).length;



        const female =
            students.filter(
                s=>s.gender==="Female"
            ).length;



        const malePercent =
            (male/total)*100;



        const femalePercent =
            (female/total)*100;



        document
        .getElementById("maleBar")
        .style.height =
            malePercent+"%";



        document
        .getElementById("femaleBar")
        .style.height =
            femalePercent+"%";


    }









    // ==========================
    // DEPARTMENT CHART
    // ==========================


    function updateDeptChart(){


        const counts = {};



        students.forEach(student=>{


            const dept =
                student.department ||
                "Unknown";



            counts[dept] =
                (counts[dept] || 0)+1;


        });



        const entries =
            Object.entries(counts);



        const total =
            students.length || 1;



        let gradient = "";

        let start = 0;




        entries.forEach(
            ([dept,count],index)=>{


                const percent =
                    (count/total)*100;



                const color =
                    `hsl(${index*60},70%,60%)`;



                gradient +=
                `${color} ${start}% ${start+percent}%,`;



                start += percent;


            }
        );



        if(gradient.length){

            gradient =
            gradient.slice(0,-1);

        }

        else{

            gradient =
            "#1e3a8a 0% 100%";

        }




        const chart =
            document.getElementById(
                "deptChartContainer"
            );


        chart.style.background =
        `conic-gradient(${gradient})`;





        const legend =
            document.getElementById(
                "deptLegend"
            );



        legend.innerHTML =
        entries.map(
            ([dept,count])=>
            `
            <span>
            📌 ${dept}: ${count}
            </span>
            `
        )
        .join(" ");



    }









    // ==========================
    // RECENT STUDENTS
    // ==========================


    function renderRecent(){


        const list =
        document.getElementById(
            "recentStudentList"
        );



        if(!students.length){


            list.innerHTML =
            `
            <li class="empty-hint">
            No students yet
            </li>
            `;


            return;

        }



        const recent =
            students
            .slice(0,5);





        list.innerHTML =
        recent.map(student=>

        `

        <li>

            <span>
            👤
            </span>


            <span>

            <strong>
            ${student.firstName}
            ${student.lastName}
            </strong>

            (${student.studentId})

            </span>


        </li>

        `

        ).join("");



    }









    // ==========================
    // DATE TIME
    // ==========================


    function updateDateTime(){


        const element =
        document.getElementById(
            "liveDateTime"
        );


        if(!element)
            return;



        const now =
            new Date();



        element.innerText =
        "📅 "+
        now.toLocaleDateString()
        +" "+
        now.toLocaleTimeString();


    }









    // ==========================
    // LOADER
    // ==========================


    function showLoader(){

        const loader =
        document.getElementById(
            "globalLoader"
        );


        if(loader){

            loader.style.display="flex";

            loader.style.opacity="1";

        }

    }



    function hideLoader(){


        const loader =
        document.getElementById(
            "globalLoader"
        );


        if(loader){


            loader.style.opacity="0";


            setTimeout(()=>{

                loader.style.display="none";


            },500);


        }


    }









    // ==========================
    // REFRESH FROM STUDENTS PAGE
    // ==========================


    window.refreshDashboard =
    function(){


        loadDashboard();


    };








    // ==========================
    // START
    // ==========================


    window.addEventListener(
        "load",
        ()=>{


            loadDashboard();


            updateDateTime();


            setInterval(
                updateDateTime,
                1000
            );


        }
    );



})();