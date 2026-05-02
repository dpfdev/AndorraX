import { CheckCircle, Printer, X } from 'lucide-react';
import './ComprobanteModal.css';

const ComprobanteModal = ({ reserva, onClose }) => {
    if (!reserva) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}><X size={20}/></button>
                
                <div id="ticket-print" className="ticket-box">
                    <div className="ticket-header">
                        <h2>ANDORRA<span style={{color: '#3b82f6'}}>X</span></h2>
                        <span className="confirmado">
                            <CheckCircle size={14}/> {reserva.estado === 'confirmada' ? 'Reserva Confirmada' : reserva.estado}
                        </span>
                    </div>

                    <div className="ticket-info">
                        <div className="ticket-row-data">
                            <span>Titular:</span>
                            {/* Usamos el nombre del usuario o un fallback */}
                            <strong>{reserva.nombre_usuario || 'Cliente AndorraX'}</strong>
                        </div>
                        <div className="ticket-row-data">
                            <span>Servicio:</span>
                            {/* CAMBIO: Usamos 'nombre_objeto' que es el que viene del JOIN de SQL */}
                            <strong style={{textTransform: 'capitalize'}}>
                                {reserva.nombre_objeto || reserva.tipo_objeto}
                            </strong>
                        </div>
                        <div className="ticket-row-data">
                            <span>Fecha Inicio:</span>
                            <strong>{new Date(reserva.fecha_inicio).toLocaleDateString()}</strong>
                        </div>
                        <div className="ticket-row-data">
                            <span>Referencia:</span>
                            <strong>#{reserva.id_reserva}</strong>
                        </div>
                    </div>

                    <div className="ticket-footer">
                        <span>Total Pagado:</span>
                        <strong>{reserva.precio}€</strong>
                    </div>
                </div>

                <button className="btn-imprimir" onClick={() => window.print()}>
                    <Printer size={18}/> Imprimir Comprobante
                </button>
            </div>
        </div>
    );
};

export default ComprobanteModal;