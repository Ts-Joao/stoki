"use client"

import { useState, useEffect } from "react"
import {
  Trash2,
  RotateCcw,
  Clock,
  AlertTriangle,
  Package,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TrashedProduct {
  id: number
  name: string
  category: string
  quantity: number
  deletedAt: Date
  deletedBy: string
  daysRemaining: number
}

const initialTrashedProducts: TrashedProduct[] = [
  { id: 1, name: "Suporte Monitor Antigo", category: "Móveis", quantity: 5, deletedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), deletedBy: "João Silva", daysRemaining: 28 },
  { id: 2, name: "Cabo VGA 5m", category: "Acessórios", quantity: 15, deletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), deletedBy: "Maria Santos", daysRemaining: 25 },
  { id: 3, name: "Mouse Com Fio Antigo", category: "Periféricos", quantity: 8, deletedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), deletedBy: "Carlos Oliveira", daysRemaining: 20 },
  { id: 4, name: "Teclado PS/2", category: "Periféricos", quantity: 3, deletedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), deletedBy: "João Silva", daysRemaining: 5 },
]

export default function TrashPage() {
  const [trashedProducts, setTrashedProducts] = useState<TrashedProduct[]>(initialTrashedProducts)
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<TrashedProduct | null>(null)

  const handleRestore = (product: TrashedProduct) => {
    setSelectedProduct(product)
    setRestoreDialogOpen(true)
  }

  const handlePermanentDelete = (product: TrashedProduct) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const confirmRestore = () => {
    if (selectedProduct) {
      setTrashedProducts(trashedProducts.filter(p => p.id !== selectedProduct.id))
    }
    setRestoreDialogOpen(false)
    setSelectedProduct(null)
  }

  const confirmDelete = () => {
    if (selectedProduct) {
      setTrashedProducts(trashedProducts.filter(p => p.id !== selectedProduct.id))
    }
    setDeleteDialogOpen(false)
    setSelectedProduct(null)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Lixeira</h1>
        <p className="text-muted-foreground">Produtos excluídos são mantidos por 30 dias antes da exclusão permanente</p>
      </div>

      {/* Warning Banner */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Atenção</p>
              <p className="text-sm text-amber-700">
                Os produtos na lixeira serão excluídos permanentemente após 30 dias. 
                Restaure-os antes do prazo para evitar perda de dados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trashed Products */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Produtos na Lixeira
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({trashedProducts.length} itens)
            </span>
          </CardTitle>
          <CardDescription>
            Restaure ou exclua permanentemente os produtos abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trashedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Trash2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground">Lixeira vazia</p>
              <p className="text-sm text-muted-foreground mt-1">
                Nenhum produto foi excluído recentemente
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {trashedProducts.map((product) => (
                <div
                  key={product.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border ${
                    product.daysRemaining <= 7 ? "border-red-200 bg-red-50/50" : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                      product.daysRemaining <= 7 ? "bg-red-100" : "bg-muted"
                    }`}>
                      <Package className={`w-5 h-5 ${
                        product.daysRemaining <= 7 ? "text-red-600" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {product.quantity} unidades
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Excluído em {formatDate(product.deletedAt)} por {product.deletedBy}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className={`w-4 h-4 ${
                        product.daysRemaining <= 7 ? "text-red-600" : "text-muted-foreground"
                      }`} />
                      <span className={`text-sm font-medium ${
                        product.daysRemaining <= 7 ? "text-red-600" : "text-muted-foreground"
                      }`}>
                        {product.daysRemaining} dias restantes
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(product)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restaurar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-100"
                        onClick={() => handlePermanentDelete(product)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Restore Dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restaurar Produto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja restaurar &quot;{selectedProduct?.name}&quot;? 
              O produto voltará para o estoque ativo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmRestore}>
              Restaurar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Permanentemente</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir permanentemente &quot;{selectedProduct?.name}&quot;? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir Permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
