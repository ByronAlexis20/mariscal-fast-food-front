import Swal from 'sweetalert2'

export default function mensajeGlobal(status, codigo_status, objetoData, tipo, nom_error, dscripcion_error){
    
    if(codigo_status == 200){//OK
        if(tipo === "C"){
            Swal.fire({
                position: 'top-end',
                title: 'Correcto!',
                text: 'Datos Consultados con Éxito!!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            });
        }

    }else if(codigo_status == 201){//CREATE

        if(tipo === "G"){
            Swal.fire({
                position: 'top-end',
                title: 'Correcto!',
                text: 'Operación Realizada Satisfactoriamente.',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
            });
        }
        
    }else if(codigo_status == 404 || codigo_status == 400){//NOT_FOUND = 404 --- BAD_REQUEST = 400
        // Swal.fire({
        //     position: 'top-end',
        //     title: 'Advertencia!',
        //     text: status,
        //     icon: 'warning',
        //     showConfirmButton: false,
        //     timer: 2500
        // })

        //setTimeout(() => {
            for (const property in objetoData) {
                //console.log(property);  
                if(property == "mensaje: " || property == "errors" || property == "mensaje" || property == "error"){
                    Swal.fire({
                        position: 'top-end',
                        title: 'Advertencia!',
                        text: `${property} ${objetoData[property]}`,
                        icon: 'warning',
                        confirmButtonAriaLabel: 'OK',
                        timer: 2500
                        
                    })
                    break;
                }  

            }
        //}, 2000);

    }else if(codigo_status == 500){//SEVERAL_ERROR
        // Swal.fire({
        //     position: 'top-end',
        //     title: 'Error!',
        //     text: status,
        //     icon: 'error',
        //     showConfirmButton: false,
        //     timer: 2500
        // })

        //setTimeout(() => {
            for (const property in objetoData) {
                Swal.fire({
                    position: 'top-end',
                    title: 'Error!',
                    text: `${property} ${objetoData[property]}`,
                    icon: 'error',
                    confirmButtonAriaLabel: 'OK'
                    
                });
                break;
            }
        //}, 3000);
    }else if(codigo_status == 401){//NO AUTORIZADO

        // Swal.fire({
        //     position: 'top-end',
        //     title: nom_error,
        //     text: status,
        //     icon: 'error',
        //     showConfirmButton: false,
        //     timer: 2500
        // })

        //setTimeout(() => {
            
                
            Swal.fire({
                position: 'top-end',
                title: nom_error,
                text: dscripcion_error,
                icon: 'error',
                confirmButtonAriaLabel: 'OK'
                
            });
                
            
        //}, 3000);


    }else if (tipo === "NV"){//alerta cuando no tiene permisos para crear
        Swal.fire({
            position: 'top',
            title: 'Advertencia!',
            text: 'No tiene permisos para crear Nuevo Registro!',
            icon: 'warning',
            showConfirmButton: true
        });
    }else if(tipo === "MD"){//alerta cuando no tiene permisos para modificar
        Swal.fire({
            position: 'top',
            title: 'Advertencia!',
            text: 'No tiene permisos para Modificar el Registro!',
            icon: 'warning',
            showConfirmButton: true  
        });
    }
}
