// change status
const buttonsChangeStatus= document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length > 0){
    buttonsChangeStatus.forEach(button => {
        const formChangeStatus = document.querySelector("#form-change-status");
        const path = formChangeStatus.getAttribute("data-path");

        button.addEventListener("click", () =>{
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "active" ? "inactive" : "active";

            const action = path + `/${statusChange}/${id}?_method=PATCH`;

            formChangeStatus.action= action;

            formChangeStatus.submit();

        });
    });
}
// end change status