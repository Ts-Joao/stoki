"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  User,
  Package,
  Edit,
  Trash2,
  Plus,
  LogIn,
  Settings,
  Download,
  FileSpreadsheet,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as XLSX from "xlsx"

const auditLogs = [
  { id: 1, timestamp: "2024-01-15 14:32:15", user: "João Silva", action: "Criou", entity: "Produto", details: "Adicionou novo produto: Teclado Sem Fio", icon: Plus },
  { id: 2, timestamp: "2024-01-15 13:45:22", user: "Maria Santos", action: "Atualizou", entity: "Produto", details: "Modificou quantidade do Cabo USB-C 2m", icon: Edit },
  { id: 3, timestamp: "2024-01-15 11:20:08", user: "João Silva", action: "Excluiu", entity: "Produto", details: "Moveu para lixeira: Suporte Monitor Antigo", icon: Trash2 },
  { id: 4, timestamp: "2024-01-15 10:15:45", user: "Carlos Oliveira", action: "Login", entity: "Sistema", details: "Usuário fez login de 192.168.1.100", icon: LogIn },
  { id: 5, timestamp: "2024-01-15 09:30:12", user: "Maria Santos", action: "Atualizou", entity: "Configurações", details: "Alterou frequência de backup para diário", icon: Settings },
  { id: 6, timestamp: "2024-01-14 16:45:33", user: "João Silva", action: "Criou", entity: "Movimentação", details: "Registrou entrada: 50 unidades de Webcam HD", icon: Package },
  { id: 7, timestamp: "2024-01-14 14:20:19", user: "Ana Costa", action: "Exportou", entity: "Relatório", details: "Baixou relatório de estoque", icon: Download },
  { id: 8, timestamp: "2024-01-14 12:10:55", user: "Carlos Oliveira", action: "Atualizou", entity: "Produto", details: "Atualizou localização da Luminária LED Mesa", icon: Edit },
  { id: 9, timestamp: "2024-01-14 10:05:28", user: "Maria Santos", action: "Restaurou", entity: "Produto", details: "Restaurou da lixeira: Cabo HDMI 3m", icon: RotateCcw },
  { id: 10, timestamp: "2024-01-14 09:00:41", user: "João Silva", action: "Login", entity: "Sistema", details: "Usuário fez login de 192.168.1.105", icon: LogIn },
]

const actionTypes = ["Todas as Ações", "Criou", "Atualizou", "Excluiu", "Login", "Exportou", "Restaurou"]
const entityTypes = ["Todas as Entidades", "Produto", "Movimentação", "Configurações", "Sistema", "Relatório"]

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAction, setSelectedAction] = useState("Todas as Ações")
  const [selectedEntity, setSelectedEntity] = useState("Todas as Entidades")

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = selectedAction === "Todas as Ações" || log.action === selectedAction
    const matchesEntity = selectedEntity === "Todas as Entidades" || log.entity === selectedEntity
    return matchesSearch && matchesAction && matchesEntity
  })

  const exportToExcel = () => {
    const exportData = filteredLogs.map(l => ({
      "Data e Hora": l.timestamp,
      "Usuário": l.user,
      "Ação": l.action,
      "Entidade": l.entity,
      "Detalhes": l.details
    }))
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Auditoria")
    XLSX.writeFile(wb, "auditoria.xlsx")
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "Criou":
        return "bg-green-100 text-green-700"
      case "Atualizou":
        return "bg-blue-100 text-blue-700"
      case "Excluiu":
        return "bg-red-100 text-red-700"
      case "Login":
        return "bg-primary/10 text-primary"
      case "Exportou":
        return "bg-purple-100 text-purple-700"
      case "Restaurou":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Auditoria</h1>
          <p className="text-muted-foreground">Acompanhe todas as atividades e ações do sistema</p>
        </div>
        <Button variant="outline" onClick={exportToExcel}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Exportar Planilha
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por usuário ou detalhes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Ação" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Entidade" />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.map((entity) => (
                    <SelectItem key={entity} value={entity}>
                      {entity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Linha do Tempo de Atividades
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredLogs.length} registros)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {filteredLogs.map((log, index) => (
              <div key={log.id} className="relative">
                {/* Timeline line */}
                {index < filteredLogs.length - 1 && (
                  <div className="absolute left-[18px] top-12 w-0.5 h-[calc(100%-16px)] bg-border" />
                )}
                
                <div className="flex gap-4 p-4 rounded-lg hover:bg-muted/20 transition-colors">
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 ${getActionColor(log.action)}`}>
                    <log.icon className="w-4 h-4" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{log.action}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-sm text-muted-foreground">{log.entity}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{log.user}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
