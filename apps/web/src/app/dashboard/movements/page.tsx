"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileSpreadsheet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as XLSX from "xlsx"

const movements = [
  { id: 1, date: "2024-01-15 14:32", product: "Teclado Sem Fio", type: "Entrada", quantity: 50, user: "João Silva" },
  { id: 2, date: "2024-01-15 13:45", product: "Cabo USB-C 2m", type: "Saída", quantity: 25, user: "Maria Santos" },
  { id: 3, date: "2024-01-15 11:20", product: "Suporte Monitor Pro", type: "Entrada", quantity: 100, user: "João Silva" },
  { id: 4, date: "2024-01-15 10:15", product: "Carregador Laptop 65W", type: "Saída", quantity: 15, user: "Carlos Oliveira" },
  { id: 5, date: "2024-01-15 09:30", product: "Mouse Pad XL", type: "Entrada", quantity: 200, user: "Maria Santos" },
  { id: 6, date: "2024-01-14 16:45", product: "Webcam HD 1080p", type: "Saída", quantity: 30, user: "João Silva" },
  { id: 7, date: "2024-01-14 14:20", product: "Cadeira Escritório Ergonômica", type: "Entrada", quantity: 20, user: "Ana Costa" },
  { id: 8, date: "2024-01-14 12:10", product: "Luminária LED Mesa", type: "Saída", quantity: 45, user: "Carlos Oliveira" },
  { id: 9, date: "2024-01-14 10:05", product: "Cabo HDMI 3m", type: "Entrada", quantity: 150, user: "Maria Santos" },
  { id: 10, date: "2024-01-14 09:00", product: "Mouse Bluetooth", type: "Saída", quantity: 60, user: "João Silva" },
  { id: 11, date: "2024-01-13 15:30", product: "Teclado Sem Fio", type: "Saída", quantity: 35, user: "Ana Costa" },
  { id: 12, date: "2024-01-13 13:15", product: "Cabo USB-C 2m", type: "Entrada", quantity: 500, user: "Carlos Oliveira" },
]

const products = ["Todos os Produtos", "Teclado Sem Fio", "Cabo USB-C 2m", "Suporte Monitor Pro", "Carregador Laptop 65W", "Mouse Pad XL", "Webcam HD 1080p"]
const movementTypes = ["Todos os Tipos", "Entrada", "Saída"]
const dateRanges = ["Todo Período", "Hoje", "Últimos 7 Dias", "Últimos 30 Dias", "Este Mês"]

export default function MovementsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("Todos os Produtos")
  const [selectedType, setSelectedType] = useState("Todos os Tipos")
  const [selectedDate, setSelectedDate] = useState("Todo Período")

  const filteredMovements = movements.filter((movement) => {
    const matchesSearch = movement.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.user.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProduct = selectedProduct === "Todos os Produtos" || movement.product === selectedProduct
    const matchesType = selectedType === "Todos os Tipos" || movement.type === selectedType
    return matchesSearch && matchesProduct && matchesType
  })

  const exportToExcel = () => {
    const exportData = filteredMovements.map(m => ({
      "Data e Hora": m.date,
      "Produto": m.product,
      "Tipo": m.type,
      "Quantidade": m.quantity,
      "Usuário": m.user
    }))
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Movimentações")
    XLSX.writeFile(wb, "movimentacoes.xlsx")
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Movimentações</h1>
          <p className="text-muted-foreground">Acompanhe todas as entradas e saídas de produtos</p>
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
                placeholder="Pesquisar por produto ou usuário..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-full sm:w-40">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Data" />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-36">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {movementTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movements Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Histórico de Movimentações
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredMovements.length} registros)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Data e Hora</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Produto</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tipo</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Quantidade</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Usuário</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.map((movement) => (
                  <tr key={movement.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <span className="text-sm text-foreground">{movement.date}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-foreground">{movement.product}</span>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="secondary"
                        className={
                          movement.type === "Entrada"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }
                      >
                        <span className="flex items-center gap-1">
                          {movement.type === "Entrada" ? (
                            <ArrowDownRight className="w-3 h-3" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3" />
                          )}
                          {movement.type}
                        </span>
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className={`font-medium ${movement.type === "Entrada" ? "text-green-600" : "text-red-600"}`}>
                        {movement.type === "Entrada" ? "+" : "-"}{movement.quantity}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{movement.user}</td>
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
