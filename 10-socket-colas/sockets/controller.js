

const { TicketControl } = require("../models/ticket-control");

const ticketControl = new TicketControl();


const socketController = (socket) => {

    // Cuando el cliente se conecta.
    socket.emit('ultimo-ticket',ticketControl.ultimo);
    socket.emit('ultimos-4',ticketControl.ultimos4);
    socket.emit('tickets-pendientes',ticketControl.tickets.length);
    
    
    
    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);
    });

    
    socket.on('atender-ticket',({escritorio},callback) => {
        
        if(!escritorio){
            return callback({
                ok:false,
                msg:'Escritorio obligatorio'
            })
        }
        
        const ticket = ticketControl.atenderTicket(escritorio);

        socket.broadcast.emit('ultimos-4',ticketControl.ultimos4);
        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);
        socket.emit('tickets-pendientes',ticketControl.tickets.length);
        
        if(!ticket){
            return callback({
                ok:false,
                msg:'Ya no hay tickets pendientes'
            })
        }
        return callback({
            ok:true,
            ticket,
        });
        


    });

}




module.exports = {
    socketController
}
