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