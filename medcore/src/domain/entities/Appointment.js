export class queueTicket{
    //Variables y metodos relacionados a los tickets de la cola
    constructor({id, tickeNumber, patientId, doctorId, appointmentId, appointment, queueDate, status, postion  }){
        this.id = id;
        this.tickeNumber = tickeNumber;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.appointmentId = appointmentId;
        this.appointment = appointment;
        this.queueDate = queueDate;
        this.status = status;
        this.postion = postion;
    }
}