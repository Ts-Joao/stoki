"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as XLSX from "xlsx"

const products = [
  { id: 1, name: "Teclado Sem Fio", category: "Periféricos", quantity: 245, minStock: 50, location: "Depósito A", status: "Em Estoque" },
  { id: 2, name: "Cabo USB-C 2m", category: "Acessórios", quantity: 892, minStock: 100, location: "Depósito B", status: "Em Estoque" },
  { id: 3, name: "Suporte Monitor Pro", category: "Móveis", quantity: 34, minStock: 40, location: "Depósito A", status: "Estoque Baixo" },
  { id: 4, name: "Carregador Laptop 65W", category: "Eletrônicos", quantity: 156, minStock: 30, location: "Depósito C", status: "Em Estoque" },
  { id: 5, name: "Mouse Pad XL", category: "Acessórios", quantity: 523, minStock: 100, location: "Depósito B", status: "Em Estoque" },
  { id: 6, name: "Webcam HD 1080p", category: "Periféricos", quantity: 12, minStock: 25, location: "Depósito A", status: "Estoque Baixo" },
  { id: 7, name: "Cadeira Escritório Ergonômica", category: "Móveis", quantity: 67, minStock: 20, location: "Depósito C", status: "Em Estoque" },
  { id: 8, name: "Luminária LED Mesa", category: "Material de Escritório", quantity: 189, minStock: 40, location: "Depósito B", status: "Em Estoque" },
  { id: 9, name: "Cabo HDMI 3m", category: "Acessórios", quantity: 8, minStock: 50, location: "Depósito A", status: "Estoque Baixo" },
  { id: 10, name: "Mouse Bluetooth", category: "Periféricos", quantity: 312, minStock: 50, location: "Depósito C", status: "Em Estoque" },
]

const categories = ["Todas as Categorias", "Eletrônicos", "Periféricos", "Acessórios", "Móveis", "Material de Escritório"]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas as Categorias")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<typeof products[0] | null>(null)

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Todas as Categorias" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const exportToExcel = () => {
    const exportData = filteredProducts.map(p => ({
      "Nome do Produto": p.name,
      "Categoria": p.category,
      "Quantidade": p.quantity,
      "Estoque Mínimo": p.minStock,
      "Localização": p.location,
      "Status": p.status
    }))
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Produtos")
    XLSX.writeFile(wb, "produtos.xlsx")
  }

  const isLowStock = (quantity: number, minStock: number) => quantity <= minStock

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Produtos</h1>
          <p className="text-muted-foreground">Gerencie os produtos do seu estoque</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportToExcel}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Exportar Planilha
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produto
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="cursor-pointer" >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Todos os Produtos
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredProducts.length} itens)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Nome do Produto</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Categoria</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Quantidade</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Estoque Mín.</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Localização</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${
                    isLowStock(product.quantity, product.minStock) ? "bg-red-50/50" : ""
                  }`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${
                          isLowStock(product.quantity, product.minStock) ? "bg-red-100" : "bg-primary/10"
                        }`}>
                          {isLowStock(product.quantity, product.minStock) ? (
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          ) : (
                            <Package className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <span className="font-medium text-foreground">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{product.category}</td>
                    <td className="p-4">
                      <span className={`font-medium ${
                        isLowStock(product.quantity, product.minStock) ? "text-red-600" : "text-foreground"
                      }`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground hidden lg:table-cell">{product.minStock}</td>
                    <td className="p-4 text-muted-foreground hidden lg:table-cell">{product.location}</td>
                    <td className="p-4">
                      <Badge
                        variant="secondary"
                        className={
                          product.status === "Em Estoque"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }
                      >
                        {isLowStock(product.quantity, product.minStock) && product.status === "Estoque Baixo" && (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {product.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer" onClick={() => setEditingProduct(product)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Product Modal */}
      <Dialog open={isAddModalOpen || !!editingProduct} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false)
          setEditingProduct(null)
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <form action={() => { setIsAddModalOpen(false); setEditingProduct(null) }}>
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Atualize os detalhes do produto abaixo." : "Preencha os detalhes para adicionar um novo produto."}
              </DialogDescription>
            </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nome do Produto</label>
              <Input placeholder="Digite o nome do produto" defaultValue={editingProduct?.name} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Descrição</label>
              <Input placeholder="Digite a descrição do produto" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Quantidade</label>
                <Input type="number" placeholder="0" defaultValue={editingProduct?.quantity} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Estoque Mínimo</label>
                <Input type="number" placeholder="0" defaultValue={editingProduct?.minStock} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Localização</label>
              <Select defaultValue={editingProduct?.location} required >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a localização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Depósito A">Depósito A</SelectItem>
                  <SelectItem value="Depósito B">Depósito B</SelectItem>
                  <SelectItem value="Depósito C">Depósito C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Categoria</label>
              <Select defaultValue={editingProduct?.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c !== "Todas as Categorias").map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddModalOpen(false)
              setEditingProduct(null)
            }}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingProduct ? "Salvar Alterações" : "Adicionar Produto"}
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
