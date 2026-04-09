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
                        <span className="confirmado"><CheckCircle size={14}/> Reserva Confirmada</span>
                    </div>

                    <div className="ticket-info">
                        <div className="ticket-row-data">
                            <span>Titular:</span>
                            <strong>{reserva.nombre_usuario}</strong>
                        </div>
                        <div className="ticket-row-data">
                            <span>Servicio:</span>
                            <strong>{reserva.nombre_item}</strong>
                        </div>
                        <div className="ticket-row-data">
                            <span>Referencia:</span>
                            <strong>#{reserva.id_reserva}</strong>
                        </div>
                    </div>

                    <div className="ticket-footer">
                        <span>Total:</span>
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