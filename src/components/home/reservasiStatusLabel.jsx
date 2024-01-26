function ReservasiStatusLabel(props) {
  const { status } = props;
  return (
    status === 'Waiting for Payment' ? <span className="badge badge-warning">{status}</span>
    : status === 'Canceled' ? <span className="badge badge-error">{status}</span>
    : <span className="badge badge-success">{status}</span>
  );
}

export default ReservasiStatusLabel;