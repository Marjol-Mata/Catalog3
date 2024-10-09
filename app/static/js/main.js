document.addEventListener("DOMContentLoaded", function () {
    const nameButton = document.getElementById('requestorNameButton');
    const departmentButton = document.getElementById('requestorDepartmentButton');
    const titleButton = document.getElementById('reportTitleButton');

    const nameSearch = document.getElementById('requestorNameSearch');
    const departmentSearch = document.getElementById('requestorDepartmentSearch');
    const titleSearch = document.getElementById('reportTitleSearch');

    const nameOptionsContainer = document.getElementById('requestorNameOptions');
    const departmentOptionsContainer = document.getElementById('requestorDepartmentOptions');
    const titleOptionsContainer = document.getElementById('reportTitleOptions');

    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton')
    const resultContainer = document.getElementById('resultContainer');


    function createOption(item, container, button) {
        let optionDiv = document.createElement('a');
        optionDiv.className = 'list-group-item list-group-item-action';
        optionDiv.textContent = item;
        optionDiv.href = "#";
        optionDiv.dataset.value = item;

        optionDiv.addEventListener('click', function (e) {
            e.preventDefault();
            button.textContent = item;
            button.dataset.value = item;
        });

        container.appendChild(optionDiv);
    }

    function fetchDataAndPopulate(url, optionsContainer, button, placeholder) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                optionsContainer.innerHTML = '';
                data.forEach(item => createOption(item, optionsContainer, button));
            });
    }


    fetchDataAndPopulate('/get_requestor_name', nameOptionsContainer, nameButton, "Select Requestor Name");
    fetchDataAndPopulate('/get_requestor_department', departmentOptionsContainer, departmentButton, "Select Requestor Department");
    fetchDataAndPopulate('/get_report_title', titleOptionsContainer, titleButton, "Select Report Title");

    function filterDropdownOptions(searchInput, optionsContainer) {
        const filterText = searchInput.value.toLowerCase();
        [...optionsContainer.children].forEach(option => {
            if (option.textContent.toLowerCase().startsWith(filterText)) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        });
    }


    nameSearch.addEventListener('input', function () {
        filterDropdownOptions(nameSearch, nameOptionsContainer);
    });

    departmentSearch.addEventListener('input', function () {
        filterDropdownOptions(departmentSearch, departmentOptionsContainer);
    });

    titleSearch.addEventListener('input', function () {
        filterDropdownOptions(titleSearch, titleOptionsContainer);
    });

    function updateDropdowns() {
        const selectedName = nameButton.dataset.value || '';
        const selectedDepartment = departmentButton.dataset.value || '';
        const selectedTitle = titleButton.dataset.value || '';

        fetchDataAndPopulate(
            `/get_requestor_department?RequestorName=${encodeURIComponent(selectedName)}&ReportTitle=${encodeURIComponent(selectedTitle)}`,
            departmentOptionsContainer,
            departmentButton,
            "Select Requestor Department"
        );

        fetchDataAndPopulate(
            `/get_report_title?RequestorName=${encodeURIComponent(selectedName)}&RequestorDepartment=${encodeURIComponent(selectedDepartment)}`,
            titleOptionsContainer,
            titleButton,
            "Select Report Title"
        );

        fetchDataAndPopulate(
            `/get_requestor_name?RequestorDepartment=${encodeURIComponent(selectedDepartment)}&ReportTitle=${encodeURIComponent(selectedTitle)}`,
            nameOptionsContainer,
            nameButton,
            "Select Requestor Name"
        );
    }

    nameOptionsContainer.addEventListener('click', function () {
        updateDropdowns();
    });

    departmentOptionsContainer.addEventListener('click', function () {
        updateDropdowns();
    });

    titleOptionsContainer.addEventListener('click', function () {
        updateDropdowns();
    });

    searchButton.addEventListener('click', function () {
        const name = nameButton.dataset.value;
        const department = departmentButton.dataset.value;
        const title = titleButton.dataset.value;

        let isValid = true;

        if (!name){
            document.getElementById('RequestorNameError').style.display = 'block'
            isValid = 'False'
            } else {
                document.getElementById('RequestorNameError').style.display = 'none'
        }
        if (!department){
            document.getElementById('RequestorDepartmentError').style.display = 'block'
            isValid = 'False'
            } else {
                document.getElementById('RequestorDepartmentError').style.display = 'none'
        }
        if (!title){
            document.getElementById('ReportTitleError').style.display = 'block'
            isValid = 'False'
            } else {
                document.getElementById('ReportTitleError').style.display = 'none'
        }
        if (!isValid) return;


        fetch(`/search?RequestorName=${encodeURIComponent(name)}&RequestorDepartment=${encodeURIComponent(department)}&ReportTitle=${encodeURIComponent(title)}`)
            .then(response => response.json())
            .then(results => {
                resultContainer.innerHTML = '';

                if (results.length > 0) {
                    let htmlContent = '<div class="result-container"><h4>Results:</h4>';

                    results.forEach(result => {
                        htmlContent += `
                            <div class="result">
                                <p class="section-title-main">Requester Information</p>
                                <p>Name: <span class="data-item">${result.RequestorName}</span></p>
                                <p>Department: <span class="data-item">${result.RequestorDepartment}</span></p>
                                <p>Email: <span class="data-item">${result.RequestorEmail}</span></p>

                                <p class="section-title">Request Details</p>
                                <p>Request Position: <span class="data-item">${result.RequestorPosition}</span></p>
                                <p>Request Date: <span class="data-item">${result.RequestDate}</span></p>
                                <p>Report Title: <span class="data-item">${result.ReportTitle}</span></p>
                                <p>Report Description: <span class="data-item">${result.ReportDescription}</span></p>
                                <p>Report Requirements: <span class="data-item">${result.ReportRequirements}</span></p>
                                <p>Request Type: <span class="data-item">${result.RequestType}</span></p>
                                <p>Purpose of Report: <span class="data-item">${result.ReportPurpose}</span></p>
                                <p>Deadline: <span class="data-item">${result.DeliveryDate}</span></p>
                                <p>Staff Data: <span class="data-item">${result.StaffData}</span></p>

                                <p class="section-title">Technical Specifications</p>
                                <p>Data Sources: <span class="data-item">${result.DataSources}</span></p>
                                <p>Data Fields: <span class="data-item">${result.DataFields}</span></p>
                                <p>Filters: <span class="data-item">${result.Filters}</span></p>

                                <p class="section-title">Agent Details</p>
                                <p>Agent Name: <span class="data-item">${result.AgentName}</span></p>
                                <p>Agent Email: <span class="data-item">${result.AgentEmail}</span></p>
                                <p>Agent Position: <span class="data-item">${result.AgentPosition}</span></p>

                                <p class="section-title">Final Report</p>
                                <p>Delivery Date: <span class="data-item">${result.DeliveryDate}</span></p>
                                <p>Delivered By: <span class="data-item">${result.DeliveredBy}</span></p>

                                <p class="section-title">Report Path</p>
                                <p>Sharepoint Link: <span class="data-item">${result.SharepointLink}</span></p>
                            </div>`;
                    });

                    htmlContent += '</div>';
                    resultContainer.innerHTML = htmlContent;
                } else {
                    resultContainer.innerHTML = '<p class="no-results">No results found.</p>';
                }
            });
    });

    clearButton.addEventListener('click', function () {
        nameButton.textContent = "Select Requestor Name";
        departmentButton.textContent = "Select Department Name";
        titleButton.textContent = "Select Report Title";

        nameButton.dataset.value = "";
        departmentButton.dataset.value = "";
        titleButton.dataset.value = "";

        nameSearch.value = "";
        departmentSearch.value = "";
        titleSearch.value = "";

        fetchDataAndPopulate('/get_requestor_name', nameOptionsContainer, nameButton, "Select Requestor Name");
        fetchDataAndPopulate('/get_requestor_department', departmentOptionsContainer, departmentButton, "Select Requestor Department");
        fetchDataAndPopulate('/get_report_title', titleOptionsContainer, titleButton, "Select Report Title");

        resultContainer.innerHTML = "";
    });
});