interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default DetailRow;