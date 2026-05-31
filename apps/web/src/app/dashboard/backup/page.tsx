"use client"

import { useState } from "react"
import {
  HardDrive,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  FileArchive,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const backupHistory = [
  { id: 1, date: "2024-01-15 06:00", type: "Automático", size: "2.4 MB", status: "Sucesso" },
  { id: 2, date: "2024-01-14 06:00", type: "Automático", size: "2.3 MB", status: "Sucesso" },
  { id: 3, date: "2024-01-13 14:30", type: "Manual", size: "2.3 MB", status: "Sucesso" },
  { id: 4, date: "2024-01-13 06:00", type: "Automático", size: "2.2 MB", status: "Sucesso" },
  { id: 5, date: "2024-01-12 06:00", type: "Automático", size: "2.2 MB", status: "Sucesso" },
]

export default function BackupPage() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateBackup = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Backup</h1>
        <p className="text-muted-foreground">Gerencie e baixe os backups do seu estoque</p>
      </div>

      {/* Last Backup Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Último Backup</CardTitle>
            <CardDescription>Informações do backup mais recente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">15 de Janeiro, 2024 às 06:00</p>
                <p className="text-sm text-muted-foreground">Backup automático · 2.4 MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Próximo Agendado</CardTitle>
            <CardDescription>Backups automáticos executam diariamente às 06:00</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">16 de Janeiro, 2024 às 06:00</p>
                <p className="text-sm text-muted-foreground">Em aproximadamente 16 horas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-medium">Ações de Backup</CardTitle>
          <CardDescription>Gere ou baixe backups manualmente</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={handleGenerateBackup} disabled={isGenerating}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
            {isGenerating ? "Gerando..." : "Gerar Backup Agora"}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Baixar Último Backup
          </Button>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Histórico de Backups</CardTitle>
          <CardDescription>Backups anteriores disponíveis para download</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Data e Hora</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tipo</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tamanho</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {backupHistory.map((backup) => (
                  <tr key={backup.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <FileArchive className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{backup.date}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{backup.type}</td>
                    <td className="p-4 text-muted-foreground">{backup.size}</td>
                    <td className="p-4">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                        {backup.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Baixar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
