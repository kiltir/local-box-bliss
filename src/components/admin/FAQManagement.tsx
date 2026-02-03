import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, GripVertical, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const FAQManagement = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    display_order: 0,
    is_active: true,
  });

  const fetchFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('faq')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Erreur lors du chargement des FAQ');
      console.error(error);
    } else {
      setFaqs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      display_order: faqs.length,
      is_active: true,
    });
    setEditingFaq(null);
  };

  const handleOpenDialog = (faq?: FAQItem) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        display_order: faq.display_order,
        is_active: faq.is_active,
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingFaq) {
      const { error } = await supabase
        .from('faq')
        .update({
          question: formData.question,
          answer: formData.answer,
          display_order: formData.display_order,
          is_active: formData.is_active,
        })
        .eq('id', editingFaq.id);

      if (error) {
        toast.error('Erreur lors de la modification');
        console.error(error);
      } else {
        toast.success('FAQ modifiée avec succès');
        handleCloseDialog();
        fetchFaqs();
      }
    } else {
      const { error } = await supabase.from('faq').insert({
        question: formData.question,
        answer: formData.answer,
        display_order: formData.display_order,
        is_active: formData.is_active,
      });

      if (error) {
        toast.error('Erreur lors de la création');
        console.error(error);
      } else {
        toast.success('FAQ créée avec succès');
        handleCloseDialog();
        fetchFaqs();
      }
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('faq').delete().eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression');
      console.error(error);
    } else {
      toast.success('FAQ supprimée avec succès');
      fetchFaqs();
    }
  };

  const handleToggleActive = async (faq: FAQItem) => {
    const { error } = await supabase
      .from('faq')
      .update({ is_active: !faq.is_active })
      .eq('id', faq.id);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
      console.error(error);
    } else {
      toast.success(faq.is_active ? 'FAQ désactivée' : 'FAQ activée');
      fetchFaqs();
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= faqs.length) return;

    const updatedFaqs = [...faqs];
    const temp = updatedFaqs[index];
    updatedFaqs[index] = updatedFaqs[newIndex];
    updatedFaqs[newIndex] = temp;

    // Update display_order for both items
    const updates = [
      { id: updatedFaqs[index].id, display_order: index },
      { id: updatedFaqs[newIndex].id, display_order: newIndex },
    ];

    for (const update of updates) {
      const { error } = await supabase
        .from('faq')
        .update({ display_order: update.display_order })
        .eq('id', update.id);

      if (error) {
        toast.error('Erreur lors de la réorganisation');
        console.error(error);
        return;
      }
    }

    fetchFaqs();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion de la FAQ</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFaq ? 'Modifier la question' : 'Ajouter une question'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question *</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  placeholder="Entrez la question..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Réponse *</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  placeholder="Entrez la réponse..."
                  rows={5}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Visible sur le site</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {editingFaq ? 'Enregistrer' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {faqs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Aucune question FAQ. Cliquez sur "Ajouter une question" pour commencer.
          </p>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  faq.is_active ? 'bg-background' : 'bg-muted/50 opacity-60'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                  >
                    <GripVertical className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === faqs.length - 1}
                  >
                    <GripVertical className="h-4 w-4 -rotate-90" />
                  </Button>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{faq.question}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {faq.answer}
                  </p>
                  {!faq.is_active && (
                    <span className="text-xs text-orange-600 mt-1 inline-block">
                      (Masquée)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={faq.is_active}
                    onCheckedChange={() => handleToggleActive(faq)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(faq)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cette question ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. La question sera définitivement supprimée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(faq.id)}>
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
