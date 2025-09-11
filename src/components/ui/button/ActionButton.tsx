import React from "react";
import {
  FaTools,
  FaDollyFlatbed,
  FaEdit,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";

// --- Base Props ---
interface ActionButtonProps {
  onClick: () => void;
}

// --- Icon Buttons ---

export const ServiceButton: React.FC<ActionButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-gray-600 hover:text-blue-800"
    title="Servis"
  >
    <FaTools size={19} />
  </button>
);

export const DistributionButton: React.FC<ActionButtonProps> = ({
  onClick,
}) => (
  <button
    onClick={onClick}
    className="text-green-600 hover:text-blue-800"
    title="Distribusi"
  >
    <FaDollyFlatbed size={20} />
  </button>
);

export const EditButton: React.FC<ActionButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-yellow-500 hover:text-yellow-700"
    title="Edit"
  >
    <FaEdit size={20} />
  </button>
);

export const DeleteButton: React.FC<ActionButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-red-600 hover:text-red-800"
    title="Hapus"
  >
    <FaTrash size={20} />
  </button>
);

export const DetailButton: React.FC<ActionButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-blue-800 hover:text-gray-600"
    title="Detail"
  >
    <FaInfoCircle size={19} />
  </button>
);

// --- Text Buttons ---

export const AddButton: React.FC<ActionButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-theme-sm"
  >
    + Tambah
  </button>
);

export const ExcelButton: React.FC<ActionButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-green-600 text-white px-3 py-1 rounded text-theme-sm hover:bg-green-700"
  >
    Excel
  </button>
);

export const PDFButton: React.FC<ActionButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-red-600 text-white px-3 py-1 rounded text-theme-sm hover:bg-red-700"
  >
    PDF
  </button>
);

export const ActionButton: React.FC<{
  onService: () => void;
  onDistribution: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ onService, onDistribution, onEdit, onDelete }) => (
  <div className="flex space-x-2">
    <ServiceButton onClick={onService} />
    <DistributionButton onClick={onDistribution} />
    <EditButton onClick={onEdit} />
    <DeleteButton onClick={onDelete} />
  </div>
);

export default ActionButton;
