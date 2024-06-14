document.addEventListener('DOMContentLoaded', function() {
    const newContactBtn = document.getElementById('newContact');
    const contactForm = document.getElementById('contactForm');
    const contactContainer = document.getElementById('contactContainer');
    const departmentFilterInput = document.getElementById('departmentFilter');
    const selectedDepartmentInput = document.getElementById('linea2');
    let contactIdCounter = 0; // Genera identificadores únicos

    // Recupera los contactos de LocalStorage al cargar la página
    const storedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    storedContacts.forEach(contact => displayContact(contact));

    // Función para mostrar y ocultar el formulario
    function toggleFormDisplay(show) {
        if (show) {
            contactForm.classList.remove('hide');
            contactForm.classList.add('show');
            contactForm.style.display = 'block';
            contactContainer.style.display = 'none';
            newContactBtn.style.display = 'none';
            selectedDepartmentInput.style.display = 'none';
        } else {
            contactForm.classList.remove('show');
            contactForm.classList.add('hide');
            setTimeout(() => {
                contactForm.style.display = 'none';
                contactContainer.style.display = 'flex'
                newContactBtn.style.display = 'flex';
                selectedDepartmentInput.style.display = 'flex';
            }, 500);
        }
    }
    window.btnGoBack = function() {
        toggleFormDisplay(false);
    };

    // Evento para mostrar u ocultar el formulario al hacer clic en el botón de nuevo contacto
    newContactBtn.addEventListener('click', function() {
        toggleFormDisplay(contactForm.style.display === 'none');
        disguiseBtn(contactForm.style.display === 'none');

    });

    // Evento al form para guardar el contacto al enviar el formulario
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        saveContact();
        contactForm.reset(); // Resetear el formulario después de guardar
        document.getElementById('contactId').value = ''; // Limpiar el campo oculto de ID
        toggleFormDisplay(false);
    });

    // Función para guardar un nuevo contacto o actualizar uno existente
    function saveContact() {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const department = document.getElementById('department').value;
        const address = document.getElementById('address').value;
        const position = document.getElementById('position').value;
        let contactId = document.getElementById('contactId').value;

        // Si no hay un ID establecido, genera uno nuevo
        if (!contactId) {
            contactId = 'contact_' + contactIdCounter++;
        }

        const contact = {
            id: contactId,
            name,
            phone,
            email,
            department,
            address,
            position
        };

        // Actualiza o añade contacto en el localStorage
        const existingContactIndex = storedContacts.findIndex(c => c.id === contactId);
        if (existingContactIndex !== -1) {
            storedContacts[existingContactIndex] = contact;
        } else {
            storedContacts.push(contact);
        }
        localStorage.setItem('contacts', JSON.stringify(storedContacts));

        // Actualizar o añadir contacto en la interfaz
        if (existingContactIndex !== -1) {
            updateContactCard(contact);
        } else {
            displayContact(contact);
        }
    }

    // Función para mostrar un contacto en la interfaz
    function displayContact(contact) {
        const contactCard = createContactCard(contact);
        contactContainer.appendChild(contactCard);
    }

    // Función para actualizar un contacto en la interfaz
    function updateContactCard(contact) {
        const contactCard = document.getElementById(contact.id);
        contactCard.querySelector('#title_' + contact.id).textContent = contact.name;
        contactCard.querySelector('#little_' + contact.id).textContent = contact.department;
        contactCard.querySelector('#item_position_' + contact.id).textContent = 'Cargo: ' + contact.position;
        contactCard.querySelector('#item_phone_' + contact.id).textContent = 'Tel: ' + contact.phone;
        contactCard.querySelector('#item_email_' + contact.id).textContent = 'Email: ' + contact.email;
        contactCard.querySelector('#item_address_' + contact.id).textContent = 'Dirección: ' + contact.address;
        contactCard.style.backgroundColor = getDepartmentColor(contact.department);
    }

    // Función para crear el elemento de un contacto
    function createContactCard(contact) {
        const { id, name, phone, email, department, address, position } = contact;

        const contactCard = document.createElement('div');
        contactCard.id = id; // Establecer el identificador único
        contactCard.classList.add('card', 'mb-3');
        contactCard.style.margin = '5px';
        contactCard.style.padding = '5px';
        contactCard.style.display = 'flex';
        contactCard.style.flexWrap = 'wrap';
        contactCard.style.width = '350px';
        contactCard.style.backgroundColor = getDepartmentColor(department);
        contactCard.style.color = 'white';
        contactCard.innerHTML = `
        <center>
        <div class="card-body" id="card-body_${id}">
            <ul class="card-body" style="position: relative;">
                <input style="font-size: 30px; width: 50px; position: absolute; top: -11px; right: -22px;" value="..." class="btn dropdown-toggle" type="button" id="departmentSelect_${id}" data-bs-toggle="dropdown" aria-expanded="false">
                <li class="card-title">
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="#" onclick="editContact('${id}')">Editar</a></li>
                        <li><a class="dropdown-item" href="#" onclick="eliminarContacto('${id}')">Eliminar</a></li>
                        <li><a class="dropdown-item" href="tel:${phone}" target="_blank">Llamar</a></li>
                        <li><a class="dropdown-item" href="https://wa.me/${phone}" target="_blank">WhatsApp</a></li>
                    </ul>
                </li>
                <center><img src="https://th.bing.com/th/id/R.6b0022312d41080436c52da571d5c697?rik=yqhDz48CzADqRw&pid=ImgRaw&r=0" width="100px" alt=""></center>
                <center><li class="card-title" id="title_${id}">${name}</li></center>
                <center><li class="card-subtitle mb-1" id="little_${id}">${department}</li></center>
                <li style="text-align: left;" class="card-text" id="item_position_${id}"><b>Cargo: </b>${position}</li>
                <li style="text-align: left;" class="card-text" id="item_phone_${id}"><b>Tel: </b>${phone}</li>
                <li style="text-align: left;" class="card-text" id="item_email_${id}"><b>Email: </b>${email}</li>
                <li style="text-align: left;" class="card-text" id="item_address_${id}"><b>Dirección: </b>${address}</li>
            </ul>
        </div>
        <center>
        `;
        return contactCard;
    }

    // Función para obtener el color del departamento
    function getDepartmentColor(department) {
        switch (department) {
            case 'Finanzas':
                return '#407445';
            case 'Ventas':
                return '#724747';
            case 'RRHH':
                return '#746A40';
            case 'Administración':
                return '#445078';
        }
    }
    // Filtrar contactos por el departamento
    departmentFilterInput.addEventListener('click', function(event) {
        const department = event.target.dataset.department;
        if (department) {
            filterContactsByDepartment(department);
            selectedDepartmentInput.value = department; // Actualiza el valor del input con el nombre del departamento que se ha seleccionado
        }
    });

    // Función para filtrar contactos por departamento
    function filterContactsByDepartment(department) {
        const contactCards = contactContainer.querySelectorAll('.card');
        contactCards.forEach(function(contactCard) {
            const contactDepartment = contactCard.querySelector('.card-subtitle').textContent;
            if (department === 'Todos' || contactDepartment === department) {
                contactCard.style.display = 'flex';
            } else {
                contactCard.style.display = 'none';
            }
        });
    }

    // Editar un contacto
    window.editContact = function(contactId) {
        // Obtener los datos del contacto existente 
        const contact = storedContacts.find(contact => contact.id === contactId);
        if (contact) {
            document.getElementById('name').value = contact.name;
            document.getElementById('phone').value = contact.phone;
            document.getElementById('email').value = contact.email;
            document.getElementById('department').value = contact.department;
            document.getElementById('address').value = contact.address;
            document.getElementById('position').value = contact.position;
            document.getElementById('contactId').value = contact.id;
            toggleFormDisplay(true);
        }
    };

    // Elimina un contacto
    window.eliminarContacto = function(contactId) {
        // Elimina el contacto del DOM
        const contactCard = document.getElementById(contactId);
        contactCard.remove();

        // Elimina el contacto del localStorage
        const contactIndex = storedContacts.findIndex(contact => contact.id === contactId);
        if (contactIndex !== -1) {
            storedContacts.splice(contactIndex, 1);
            localStorage.setItem('contacts', JSON.stringify(storedContacts));
        }
    };

    // confi del contenedor en dado caso ya no quepa dentro del contenedor se acomodara abajo de las demas tarjetas
    contactContainer.style.display = 'flex';
    contactContainer.style.flexWrap = 'wrap';
});
