"use client"

import { Package, AlertTriangle, Trash2, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import Link from "next/link"

const stats = [
  {
    name: "Total de Produtos",
    value: "2.847",
    change: "+12%",
    color: "blue",
    icon: Package,
    href: "/dashboard/products"
  },
  {
    name: "Baixo Estoque",
    value: "23",
    change: "-5%",
    color: "red",
    icon: AlertTriangle,
    href: "/dashboard/products"
  },
  {
    name: "Produtos na Lixeira",
    value: "8",
    change: "+2",
    color: "slate",
    icon: Trash2,
    href: "/dashboard/trash"
  },
  {
    name: "Movimentações Hoje",
    value: "156",
    change: "+18%",
    color: "green",
    icon: TrendingUp,
    href: "/dashboard/movements"
  },
] as const

const colorClasses = {
  blue: {
    card: "border-t-4 border-t-blue-500",
    iconBg: "bg-blue-100",
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  red: {
    card: "border-t-4 border-t-red-500",
    iconBg: "bg-red-100",
    icon: "text-red-600",
    badge: "bg-red-100 text-red-700 hover:bg-red-100",
  },
  green: {
    card: "border-t-4 border-t-green-500",
    iconBg: "bg-green-100",
    icon: "text-green-600",
    badge: "bg-green-100 text-green-700 hover:bg-green-100",
  },
  slate: {
    card: "border-t-4 border-t-slate-500",
    iconBg: "bg-slate-100",
    icon: "text-slate-600",
    badge: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  },
} as const

const recentMovements = [
  { id: 1, product: "Teclado Sem Fio", type: "Entrada", quantity: 50, user: "João Silva", date: "2 min atrás" },
  { id: 2, product: "Cabo USB-C", type: "Saída", quantity: 25, user: "Maria Santos", date: "15 min atrás" },
  { id: 3, product: "Suporte Monitor", type: "Entrada", quantity: 100, user: "João Silva", date: "1 hora atrás" },
  { id: 4, product: "Carregador Laptop", type: "Saída", quantity: 15, user: "Carlos Oliveira", date: "2 horas atrás" },
  { id: 5, product: "Mouse Pad XL", type: "Entrada", quantity: 200, user: "Maria Santos", date: "3 horas atrás" },
]

const chartData = [
  { name: "Jan", entries: 400, exits: 240 },
  { name: "Fev", entries: 300, exits: 139 },
  { name: "Mar", entries: 520, exits: 380 },
  { name: "Abr", entries: 278, exits: 390 },
  { name: "Mai", entries: 489, exits: 280 },
  { name: "Jun", entries: 439, exits: 340 },
  { name: "Jul", entries: 590, exits: 420 },
]

const categoryData = [
  { name: "Eletrônicos", count: 847 },
  { name: "Material de Escritório", count: 623 },
  { name: "Móveis", count: 412 },
  { name: "Periféricos", count: 589 },
  { name: "Acessórios", count: 376 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Painel</h1>
          <p className="text-muted-foreground">
            Visão geral do desempenho do seu estoque
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="cursor-pointer" asChild>
            <Link href="/dashboard/export">
              Exportar Planilha
            </Link>
          </Button>

          <Button className="cursor-pointer" asChild>
            <Link href="/dashboard/products">
              Adicionar Produto
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid - Mobile optimized */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
        {stats.map((stat) => {
          const colors = colorClasses[stat.color]

          return (
            <Link href={stat.href} key={stat.name}>
              <Card
                className={`border-border/50 transition-all hover:shadow-md ${colors.card}`}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${colors.iconBg}`}
                    >
                      <stat.icon
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.icon}`}
                      />
                    </div>

                    <Badge
                      variant="secondary"
                      className={`text-xs ${colors.badge}`}
                    >
                      {stat.change}
                    </Badge>
                  </div>

                  <div className="mt-3">
                    <p className="text-xl sm:text-2xl font-semibold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {stat.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Inventory Overview Chart */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base font-medium">Visão Geral do Estoque</CardTitle>
                <CardDescription>Entradas vs Saídas este ano</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">Entradas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">Saídas</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEntries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 250)" />
                  <XAxis dataKey="name" stroke="oklch(0.5 0.02 250)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.5 0.02 250)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.91 0.01 250)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: number, name: string) => [
                      value,
                      name === "entries" ? "Entradas" : "Saídas"
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="entries"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorEntries)"
                  />
                  <Area
                    type="monotone"
                    dataKey="exits"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExits)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Categories Chart */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">Produtos por Categoria</CardTitle>
                <CardDescription>Distribuição por categorias</CardDescription>
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+8,2%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 250)" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="oklch(0.5 0.02 250)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="oklch(0.5 0.02 250)" fontSize={11} tickLine={false} axisLine={false} width={110} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.91 0.01 250)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: number) => [value, "Quantidade"]}
                  />
                  <Bar dataKey="count" fill="oklch(0.55 0.2 250)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Movements */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium">Movimentações Recentes</CardTitle>
              <CardDescription>Últimas entradas e saídas de estoque</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {recentMovements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between py-2 sm:py-3 border-b border-border/50 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${movement.type === "Entrada"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                      }`}
                  >
                    {movement.type === "Entrada" ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{movement.product}</p>
                    <p className="text-xs text-muted-foreground">
                      {movement.type} por {movement.user}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${movement.type === "Entrada" ? "text-green-600" : "text-red-600"
                    }`}>
                    {movement.type === "Entrada" ? "+" : "-"}{movement.quantity} unidades
                  </p>
                  <p className="text-xs text-muted-foreground">{movement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
