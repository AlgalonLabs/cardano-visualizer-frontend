interface InfoCardProps {
  value: number | string;
  label: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ value, label }) => (
  <div className="bg-gray-100 p-4 rounded-lg text-center">
    <div className="text-xl font-bold">{value}</div>
    <div className="text-sm uppercase">{label}</div>
  </div>
);

export default InfoCard;