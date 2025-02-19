import { 
    Plus, 
    Text, 
    List, 
    CheckSquare, 
    Calendar, 
    Hash, 
    Mail, 
    ChevronDown, 
    Circle,
    FileText,
    Phone,
    Link,
    Clock,
    MapPin,
    Upload,
    CreditCard,
    UserCircle,
    MessageSquare
  } from "lucide-react";
  
  // Enhanced icon implementation with all imported icons
  const getIcon = (type: string) => {
    switch (type) {
      // Text inputs
      case 'text':
        return <Text className="h-4 w-4 text-primary" />;
      case 'textarea':
        return <MessageSquare className="h-4 w-4 text-primary" />;
      
      // Selection inputs
      case 'dropdown':
        return <ChevronDown className="h-4 w-4 text-accent-info" />;
      case 'checkbox':
        return <CheckSquare className="h-4 w-4 text-accent-purple" />;
      case 'radio':
        return <Circle className="h-4 w-4 text-secondary" />;
      case 'list':
        return <List className="h-4 w-4 text-accent-info" />;
      
      // Date and time
      case 'date':
        return <Calendar className="h-4 w-4 text-accent-pink" />;
      case 'time':
        return <Clock className="h-4 w-4 text-accent-warning" />;
      
      // Specialized inputs
      case 'number':
        return <Hash className="h-4 w-4 text-accent-warning" />;
      case 'email':
        return <Mail className="h-4 w-4 text-accent-success" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-accent-info" />;
      case 'url':
        return <Link className="h-4 w-4 text-accent-info" />;
      case 'file':
        return <Upload className="h-4 w-4 text-accent-error" />;
      
      // Complex fields
      case 'address':
        return <MapPin className="h-4 w-4 text-accent-success" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-accent-error" />;
      case 'user':
        return <UserCircle className="h-4 w-4 text-accent-purple" />;
      case 'document':
        return <FileText className="h-4 w-4 text-primary" />;
      
      // Default/Add new
      case 'add':
        return <Plus className="h-4 w-4 text-primary" />;
      default:
        return <span className="text-neutral-muted text-xs">?</span>;
    }
  };
  
  // Color scheme to match icons for consistent visual language
  const getElementColor = (type: string): string => {
    const colors: Record<string, string> = {
      'text': 'bg-primary/10 border-primary/30',
      'textarea': 'bg-primary/5 border-primary/20',
      
      'dropdown': 'bg-accent-info/10 border-accent-info/30',
      'checkbox': 'bg-accent-purple/10 border-accent-purple/30',
      'radio': 'bg-secondary/10 border-secondary/30',
      'list': 'bg-accent-info/5 border-accent-info/20',
      
      'date': 'bg-accent-pink/10 border-accent-pink/30',
      'time': 'bg-accent-warning/5 border-accent-warning/20',
      
      'number': 'bg-accent-warning/10 border-accent-warning/30',
      'email': 'bg-accent-success/10 border-accent-success/30',
      'phone': 'bg-accent-info/10 border-accent-info/25',
      'url': 'bg-accent-info/5 border-accent-info/15',
      'file': 'bg-accent-error/10 border-accent-error/30',
      
      'address': 'bg-accent-success/5 border-accent-success/20',
      'payment': 'bg-accent-error/5 border-accent-error/15',
      'user': 'bg-accent-purple/5 border-accent-purple/15',
      'document': 'bg-primary/7 border-primary/15',
    };
    return colors[type] || 'bg-neutral-light border-neutral-muted';
  };
  
  export { getIcon, getElementColor };