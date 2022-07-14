import axios from "axios";
import url from "../js/urlBase";
import Swal from 'sweetalert2';
export default function authHeader() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        axios.get(url[0].urlBase + `/api/auth/test`, { headers: { "Authorization": `Bearer ${user.token}` } } ).then(() => {
            
        }).catch(() => {
            Swal.fire({
                title: 'Información',
                text: "Se cerrará la sesión actual",
                icon: 'info',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("user");
                    window.location.href = '/';
                }
            }) 
            return;
        });
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
}