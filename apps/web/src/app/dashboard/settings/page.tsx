"use client"

import { useState } from "react"
import {
  User,
  Lock,
  Bell,
  Palette,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie sua conta e preferências do sistema</p>
      </div>

      {/* Profile Settings */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">Informações do Perfil</CardTitle>
              <CardDescription>Atualize seus dados pessoais</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nome</label>
              <Input placeholder="João" defaultValue="João" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sobrenome</label>
              <Input placeholder="Silva" defaultValue="Silva" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">E-mail</label>
            <Input type="email" placeholder="joao@empresa.com" defaultValue="joao@empresa.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Cargo</label>
            <Input value="Administrador" disabled className="bg-muted" />
          </div>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">Alterar Senha</CardTitle>
              <CardDescription>Atualize sua senha para manter sua conta segura</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Senha Atual</label>
            <Input type="password" placeholder="Digite a senha atual" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nova Senha</label>
              <Input type="password" placeholder="Digite a nova senha" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirmar Nova Senha</label>
              <Input type="password" placeholder="Confirme a nova senha" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">Notificações</CardTitle>
              <CardDescription>Configure como você recebe notificações</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Alertas de Estoque Baixo</p>
              <p className="text-sm text-muted-foreground">Receba notificações quando produtos estiverem com estoque baixo</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Relatórios Diários</p>
              <p className="text-sm text-muted-foreground">Receba resumo diário do estoque por e-mail</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Notificações de Backup</p>
              <p className="text-sm text-muted-foreground">Receba notificação quando backups forem concluídos</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">Preferências do Sistema</CardTitle>
              <CardDescription>Personalize as configurações do sistema</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Idioma</label>
              <Select defaultValue="pt-BR">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fuso Horário</label>
              <Select defaultValue="america-sao-paulo">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fuso horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america-sao-paulo">América/São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="america-manaus">América/Manaus (GMT-4)</SelectItem>
                  <SelectItem value="america-recife">América/Recife (GMT-3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Formato de Data</label>
            <Select defaultValue="dmy">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o formato de data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dmy">DD/MM/AAAA</SelectItem>
                <SelectItem value="mdy">MM/DD/AAAA</SelectItem>
                <SelectItem value="ymd">AAAA-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  )
}
