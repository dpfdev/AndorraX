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
                        <h2>AndorraX</h2>
                        <span className="confirmado"><CheckCircle size={14}/> Reserva Confirmada</span>
                    </div>
                    <div className="ticket-info">
                        <p><strong>Titular:</strong> {reserva.nombre_usuario}</p>
                        <p><strong>Servicio:</strong> {reserva.nombre_item}</p>
                        <p><strong>Referencia:</strong> #{reserva.id_reserva}</p>
                        <p><strong>Fecha:</strong> {new Date(reserva.fecha_inicio).toLocaleDateString()}</p>
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