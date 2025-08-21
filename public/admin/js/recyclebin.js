// redelete item

const buttonsRedelete = document.querySelectorAll("[button-redelete]");
if(buttonsRedelete.length > 0){

    const formRedeleteItem = document.querySelector("#form-redelete-item");
    const path = formRedeleteItem.getAttribute("data-path");

    buttonsRedelete.forEach(button => {
        button.addEventListener("click", () =>{
            const isConfirm = confirm("Bạn có chắc muốn khôi phục sản phẩm này?");
            if(isConfirm){
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=PATCH`;
                formRedeleteItem.action = action;
                formRedeleteItem.submit();
            }else{

            }
        });
    });
}

// End redelete item

// delete item

const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsDelete.length > 0){

    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonsDelete.forEach(button => {
        button.addEventListener("click", () =>{
            const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này vĩnh viễn?");
            if(isConfirm){
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;
                formDeleteItem.action = action;
                formDeleteItem.submit();
            }else{

            }
        });
    });
}

// End delete item