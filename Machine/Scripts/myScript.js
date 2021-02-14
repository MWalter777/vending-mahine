var order = [];
var dispatched = [];
var creating = false;
var data = [
    {
        id: 1,
        image: "https://userscontent2.emaze.com/images/bc6288eb-5280-4ad6-bee9-198faa85ab48/6dd8cd2ebc272b5907a97c2a6d94b5fc.png",
        name: "Cocacola",
        price: 1.5,
        time: 2
    },
    {
        id: 2,
        image: "https://images.vexels.com/media/users/3/190236/isolated/preview/9a2eb2186a42d9d0d802596a43aa7d43-papas-fritas-kawaii-planas-by-vexels.png",
        name: "Potatoes",
        price: 0.5,
        time: 5
    },
    {
        id: 3,
        image: "https://pngimg.com/uploads/mug_coffee/mug_coffee_PNG16839.png",
        name: "Coffe",
        price: 1.2,
        time: 7
    },
];


$(document).ready(function () {
    createMachine();
    $('#load').hide();
});

function createMachine() {
    var items = ``;
    for (let i = 0; i < data.length; i++) {
        let tag = `
                        <div class ="vending">
                            <img src="${data[i].image}" alt="${data[i].name}" />
                            <strong>${data[i].name} ${'$'+data[i].price}</strong>
                            <button class ="btn btn-outline-primary" onclick="orderItem(${data[i].id})">Add</button>
                        </div>
                `;
        $('#items-vending').append(tag);
    }
}

function orderItem(id) {
    if (creating === false) {
        let orderI = order.filter((d) =>d.id === id)[0];
        if (orderI) {
            order = order.map((val) => {
                if (val.id === id){
                    val.quantity = val.quantity + 1;
                }
                return val;
            });
            updateOrder(id);
        } else {
            let value = data.filter((d) =>d.id === id)[0];
            if (value) {
                let obj = {
                    id: value.id,
                    name: value.name,
                    quantity: 1,
                    time: value.time,
                    price: value.price
                };
                order.push(obj);
                createOrder(id);
            }
        }
    }
}

function updateOrder(id) {
    let value = order.filter((d) =>d.id === id)[0];
    let textId = `#order-item-id-${id}`;
    let timeID = `#order-item-time-id-${id}`;
    console.log(textId);
    if (value) {
        $(textId).text(value.quantity);
        $(timeID).text(value.quantity * value.time + 's');
    }
}

function createOrder(id) {
    let value = order.filter((d) =>d.id === id)[0];
    let tag = `
            <div class ="item-order" id="item-order-id-${id}">
                <strong>${value.name} ${'$' + value.price}</strong>
                <strong>Quantity: <span id="order-item-id-${id}">${value.quantity}</span></strong>
                <strong>Time: <span id="order-item-time-id-${id}">${value.quantity * value.time + 's'}</span></strong>
                <button class ="btn btn-outline-danger" onclick="deleteItem(${value.id})"> <i class ="fa fa-trash"></i> </button>
            </div>
        `;
    $('#item-order').append(tag);
}

function deleteItem(id) {
    let value = order.filter((d) =>d.id === id)[0];
    if (value) {
        if (value.quantity > 1) {
            order = order.map((val) => {
                val.quantity = val.quantity - 1;
                return val;
            });
            updateOrder(id);
        } else {
            let itemDelete = `#item-order-id-${id}`;
            order = order.filter((d) => d.id !== id);
            $(itemDelete).remove();
        }
    }
}

function showTime(time){
    $('#time-dispatching-id').text(`Time: ${time}`);
}


async function dispatchOrder(){
    creating = true;
    $('#load').show();
    for (let i = 0; i < order.length; i++) {
        let val = order[i];
        let time =val.time*val.quantity;
        let count = 0;
        showTime(time);
        for(let j=0; j < val.quantity; j++){
            $('#dispatching-id').text(`Dispaging: ${val.name} ${j+1} of ${val.quantity}`);
            console.log(val);
            for (let k = 0; k < val.time; k++){
                count += 1;
                await waitOneSecond();
                showTime(time-count);
            }
            //const result = await resolveAfter(val);
        }
        let itemDelete = `#item-order-id-${val.id}`;
        $(itemDelete).remove();
    }
    creating = false;
    $('#load').hide();
    let newOrderDispached = {time: new Date(), data: [...order]};
    createOrderDispached(newOrderDispached);
    dispatched = [...dispatched, newOrderDispached];
    order = [];
}

function resolveAfter(value) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, value.time*1000);
    });
}

function waitOneSecond() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("Second pass");
            resolve('resolved');
        }, 1000);
    });
}

function createOrderDispached(value){
    let newId = `dispatched-item-id-${value.time}`;
    let item = ``;
    let date = value.time.toLocaleDateString();
    for (let i = 0; i < value.data.length; i++){
        item += `
                    <div class="item-order">
                        <strong>${value.data[i].name}</strong>
                        <strong>Quantity: ${value.data[i].quantity}</strong>
                    </div>
                    `;
    }
    let items = `
                    <div class="dispatched-item" id="${newId}">
                        <h4>Dispached at: ${date}</h4>
                        <div class="item-order-dispached">
                            ${item}
                        </div>
                    </div>
                `;
    $('#all-dispached').append(items);
}



