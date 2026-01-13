"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Plane,
  Building2,
  Package,
  DollarSign,
  FileText,
  Receipt,
  Users,
  Ship,
  Warehouse,
  Banknote,
  Truck,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EcosystemEntity {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  position: { x: number; y: number };
}

interface ProcessStep {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  position: { x: number; y: number };
  connectedEntities: string[];
}

interface EndToEndFlowProps {
  className?: string;
  title?: string;
  lightColor?: string;
}

const EndToEndFlow: React.FC<EndToEndFlowProps> = ({
  className,
  title = "Gestão end-to-end, tudo em um único lugar",
  lightColor = "#3B82F6",
}) => {
  // Entidades do Ecossistema (linha superior)
  const ecosystemEntities: EcosystemEntity[] = [
    {
      id: "despachante-1",
      label: "Despachante",
      icon: Building2,
      color: "#1E40AF",
      position: { x: 10, y: 15 },
    },
    {
      id: "parceiro",
      label: "Parceiro comercial",
      icon: Users,
      color: "#1E40AF",
      position: { x: 10, y: 25 },
    },
    {
      id: "agente-1",
      label: "Agente de carga",
      icon: Ship,
      color: "#1E40AF",
      position: { x: 30, y: 15 },
    },
    {
      id: "armador",
      label: "Armador",
      icon: Ship,
      color: "#1E40AF",
      position: { x: 30, y: 25 },
    },
    {
      id: "agente-2",
      label: "Agente de carga",
      icon: Ship,
      color: "#1E40AF",
      position: { x: 50, y: 15 },
    },
    {
      id: "porto-1",
      label: "Porto / Aeroporto",
      icon: Warehouse,
      color: "#1E40AF",
      position: { x: 50, y: 25 },
    },
    {
      id: "despachante-2",
      label: "Despachante",
      icon: Building2,
      color: "#7C3AED",
      position: { x: 70, y: 15 },
    },
    {
      id: "porto-2",
      label: "Porto / Aeroporto",
      icon: Warehouse,
      color: "#7C3AED",
      position: { x: 70, y: 25 },
    },
    {
      id: "banco",
      label: "Banco",
      icon: Banknote,
      color: "#EC4899",
      position: { x: 85, y: 15 },
    },
    {
      id: "exportador",
      label: "Exportador",
      icon: Users,
      color: "#EC4899",
      position: { x: 85, y: 25 },
    },
    {
      id: "terceiros",
      label: "Terceiros",
      icon: Users,
      color: "#F97316",
      position: { x: 95, y: 20 },
    },
    {
      id: "despachante-3",
      label: "Despachante",
      icon: Building2,
      color: "#EA580C",
      position: { x: 105, y: 15 },
    },
    {
      id: "transportadora",
      label: "Transportadora",
      icon: Truck,
      color: "#EA580C",
      position: { x: 105, y: 25 },
    },
  ];

  // Passos do Processo (linha inferior)
  const processSteps: ProcessStep[] = [
    {
      id: "pedidos",
      label: "Gestão de pedidos",
      icon: ShoppingCart,
      color: "#6B7280",
      position: { x: 15, y: 70 },
      connectedEntities: ["despachante-1", "parceiro"],
    },
    {
      id: "transporte",
      label: "Transporte internacional",
      icon: Plane,
      color: "#6B7280",
      position: { x: 35, y: 70 },
      connectedEntities: ["agente-1", "armador"],
    },
    {
      id: "alfandega",
      label: "Alfândega",
      icon: Building2,
      color: "#1E40AF",
      position: { x: 55, y: 70 },
      connectedEntities: ["agente-2", "porto-1"],
    },
    {
      id: "entrega",
      label: "Entrega",
      icon: Package,
      color: "#7C3AED",
      position: { x: 75, y: 70 },
      connectedEntities: ["despachante-2", "porto-2"],
    },
    {
      id: "cambio",
      label: "Câmbio",
      icon: DollarSign,
      color: "#EC4899",
      position: { x: 90, y: 70 },
      connectedEntities: ["banco", "exportador"],
    },
    {
      id: "portal",
      label: "Portal de notas e despesas",
      icon: FileText,
      color: "#F97316",
      position: { x: 100, y: 70 },
      connectedEntities: ["terceiros"],
    },
    {
      id: "notas",
      label: "Notas fiscais",
      icon: Receipt,
      color: "#EA580C",
      position: { x: 110, y: 70 },
      connectedEntities: ["despachante-3", "transportadora"],
    },
  ];

  // Gerar paths de conexão
  const generateConnectionPath = (
    from: { x: number; y: number },
    to: { x: number; y: number }
  ): string => {
    const midY = (from.y + to.y) / 2;
    return `M ${from.x} ${from.y} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${to.y}`;
  };

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center py-12 px-4",
        className
      )}
    >
      {/* Título */}
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.h2>

      {/* Container Principal */}
      <div className="relative w-full max-w-7xl h-[600px] md:h-[700px]">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 120 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradientes para as luzes */}
            {processSteps.map((step) => (
              <radialGradient
                key={`grad-${step.id}`}
                id={`grad-${step.id}`}
                fx="0.5"
                fy="0.5"
              >
                <stop offset="0%" stopColor={step.color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={step.color} stopOpacity="0" />
              </radialGradient>
            ))}
            {/* Máscaras para animação das conexões */}
            {processSteps.map((step) =>
              step.connectedEntities.map((entityId, idx) => {
                const entity = ecosystemEntities.find((e) => e.id === entityId);
                if (!entity) return null;
                return (
                  <mask key={`mask-${step.id}-${idx}`} id={`mask-${step.id}-${idx}`}>
                    <path
                      d={generateConnectionPath(entity.position, step.position)}
                      stroke="white"
                      strokeWidth="0.3"
                      fill="none"
                    />
                  </mask>
                );
              })
            )}
          </defs>

          {/* Conexões entre Ecossistema e Processo */}
          {processSteps.map((step) =>
            step.connectedEntities.map((entityId, idx) => {
              const entity = ecosystemEntities.find((e) => e.id === entityId);
              if (!entity) return null;
              return (
                <g key={`connection-${step.id}-${entityId}`}>
                  <path
                    d={generateConnectionPath(entity.position, step.position)}
                    stroke={step.color}
                    strokeWidth="0.2"
                    strokeDasharray="1 1"
                    fill="none"
                    opacity="0.3"
                  />
                  {/* Luz animada na conexão */}
                  <motion.circle
                    r="1.5"
                    fill={step.color}
                    opacity="0.6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path={generateConnectionPath(entity.position, step.position)}
                    />
                  </motion.circle>
                </g>
              );
            })
          )}

          {/* Linha de conexão entre os passos do processo */}
          <path
            d={`M ${processSteps[0].position.x} ${processSteps[0].position.y} ${processSteps
              .slice(1)
              .map((step) => `L ${step.position.x} ${step.position.y}`)
              .join(" ")}`}
            stroke="#6B7280"
            strokeWidth="0.4"
            strokeDasharray="2 2"
            fill="none"
            opacity="0.4"
          />
        </svg>

        {/* Renderizar Entidades do Ecossistema */}
        {ecosystemEntities.map((entity, idx) => {
          const Icon = entity.icon;
          return (
            <motion.div
              key={entity.id}
              className="absolute"
              style={{
                left: `${entity.position.x}%`,
                top: `${entity.position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <div
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg border-2 bg-white dark:bg-gray-900 shadow-md",
                  `border-[${entity.color}]`
                )}
                style={{ borderColor: entity.color }}
              >
                <Icon className="w-4 h-4" style={{ color: entity.color }} />
                <span className="text-[8px] md:text-[10px] font-medium text-center max-w-[60px]">
                  {entity.label}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Renderizar Passos do Processo */}
        {processSteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.id}
              className="absolute"
              style={{
                left: `${step.position.x}%`,
                top: `${step.position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
            >
              <div
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border-2 bg-white dark:bg-gray-900 shadow-lg min-w-[100px] md:min-w-[120px]"
                )}
                style={{ borderColor: step.color }}
              >
                <div
                  className="p-2 rounded-full"
                  style={{ backgroundColor: `${step.color}20` }}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: step.color }} />
                </div>
                <span className="text-[10px] md:text-xs font-semibold text-center">
                  {step.label}
                </span>
                {/* Indicador de progresso */}
                <motion.div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 rounded-full"
                  style={{ backgroundColor: step.color, width: "80%" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1 + idx * 0.1, duration: 0.5 }}
                />
              </div>
            </motion.div>
          );
        })}

        {/* Labels das Linhas */}
        <div className="absolute left-4 top-8">
          <span className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400">
            ECOSSISTEMA
          </span>
        </div>
        <div className="absolute left-4 bottom-8">
          <span className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400">
            IMPORTADOR
          </span>
        </div>
      </div>

      {/* Badge de destaque */}
      <motion.div
        className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <CheckCircle2 className="w-4 h-4" />
        <span className="text-sm font-medium">
          Tudo integrado em uma única plataforma
        </span>
      </motion.div>
    </div>
  );
};

export default EndToEndFlow;
