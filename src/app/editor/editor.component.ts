import {
  Component,
  ElementRef,
  HostListener,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface ContentItem {
  textArea: boolean;
  text: string | null;
  button: boolean;
  image: boolean;
  imageFile: string | null;
  imageSize: 'standard' | 'larger' | 'fullWidth' | null;
  caption: string | null;
  active: boolean;
  selected: boolean;
}

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent {
  @ViewChildren('newTextarea') textareas!: QueryList<ElementRef>;
  @ViewChildren('artDiv') artDiv!: QueryList<ElementRef>;

  title: string = '';
  activeIndex: number | null = null;
  isSelecting: boolean = false;
  draggedIndex: number | null = null;
  contentList: ContentItem[] = [
    {
      textArea: true,
      text: '',
      button: false,
      image: false,
      imageFile: null,
      imageSize: null,
      caption: null,
      active: false,
      selected: false,
    },
  ];

  constructor(private router: Router) {}

  addImage(index: number) {
    this.contentList[index].image = true;
    this.contentList[index].textArea = false;
    const newBlock: ContentItem = {
      textArea: false,
      text: null,
      button: false,
      image: false,
      imageFile: null,
      imageSize: null,
      caption: null,
      active: false,
      selected: false,
    };
    this.contentList.push(newBlock);
    this.setActiveItem(index + 1);
  }

  closeOption(index: number) {
    this.contentList[index].image = false;
    this.contentList[index].imageFile = null;
    this.contentList[index].imageSize = null;
    this.contentList[index].textArea = true;
    this.setActiveItem(index);
  }

  onImageChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.contentList[index].imageFile = reader.result as string;
        this.activeIndex = index;
      };
      reader.readAsDataURL(file);
      const newBlock: ContentItem = {
        textArea: true,
        text: null,
        button: true,
        image: false,
        imageFile: null,
        imageSize: null,
        caption: null,
        active: true,
        selected: false,
      };

      this.contentList.splice(index + 1, 0, newBlock);
      this.setActiveItem(index + 1);
      setTimeout(() => {
        const textareaArray = this.textareas.toArray();
        if (textareaArray[index + 1]) {
          textareaArray[index + 1].nativeElement.focus();
        }
      });
    }
  }

  onImageSizeSelect(index: number) {
    this.setActiveItem(index + 1);
    const textareaArray = this.textareas.toArray();
    if (textareaArray[index + 1]) {
      textareaArray[index + 1].nativeElement.focus();
    }
  }

  deleteContent(index: number) {
    if (this.contentList.length <= 1) {
      return;
    }

    this.contentList.splice(index, 1);
    this.setActiveItem(index - 1);
    setTimeout(() => {
      const textareaArray = this.textareas.toArray();
      if (textareaArray[index - 1]) {
        textareaArray[index - 1].nativeElement.focus();
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode == 65) {
      this.selectAll();
      $event.preventDefault();
    }
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 13) {
      console.log('shifrt +  enter');
      const textareaArray = this.textareas.toArray();
      if (textareaArray[this.activeIndex!]) {
        textareaArray[this.activeIndex!].nativeElement.focus();
        textareaArray[this.activeIndex!].nativeElement.style.height = `${
          textareaArray[this.activeIndex!].nativeElement.scrollHeight
        }px`;
      }
    }
    if ($event.keyCode == 8) {
      if (this.contentList.every((cl) => cl.selected)) {
        this.contentList = [
          {
            textArea: true,
            text: '',
            button: false,
            image: false,
            imageFile: null,
            imageSize: null,
            caption: null,
            active: false,
            selected: false,
          },
        ];
        this.activeIndex = null;
      }
    }
  }

  onEnterPress(event: any, index: number) {
    if (event.key === 'Enter' && !event.shiftKey) {
      const newBlock: ContentItem = {
        textArea: true,
        text: null,
        button: true,
        image: false,
        imageFile: null,
        imageSize: null,
        caption: null,
        active: true,
        selected: false,
      };

      this.contentList.splice(index + 1, 0, newBlock);
      this.setActiveItem(index + 1);
      setTimeout(() => {
        const textareaArray = this.textareas.toArray();
        if (textareaArray[index + 1]) {
          textareaArray[index + 1].nativeElement.focus();
        }
      });
      event.preventDefault();
    }
  }

  onBackspacePress(event: any, index: number) {
    if (event.key === 'Backspace' && !this.contentList[index].text) {
      const textareaArray = this.textareas.toArray();
      if (textareaArray[this.activeIndex!]) {
        textareaArray[this.activeIndex!].nativeElement.focus();
        textareaArray[this.activeIndex!].nativeElement.style.height = `5px`;
      }
      this.deleteContent(index);
      event.preventDefault();
    }
  }

  onArrowUpPress(event: any, index: number) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.setActiveItem(index - 1);
      const textareaArray = this.textareas.toArray();
      if (textareaArray[index - 1]) {
        textareaArray[index - 1].nativeElement.focus();
      }
    }
  }

  onArrowDownPress(event: any, index: number) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.setActiveItem(index + 1);
      const textareaArray = this.textareas.toArray();
      if (textareaArray[index + 1]) {
        textareaArray[index + 1].nativeElement.focus();
      }
    }
  }

  setActiveItem(index: number) {
    this.activeIndex = index;
  }

  selectAll() {
    this.contentList.forEach((item) => (item.selected = true));
  }

  deselectAll() {
    this.contentList.forEach((item) => (item.selected = false));
  }

  onDragStart(index: number) {
    this.draggedIndex = index;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(index: number) {
    if (this.draggedIndex !== null) {
      const [draggedItem] = this.contentList.splice(this.draggedIndex, 1);
      this.contentList.splice(index, 0, draggedItem);
      this.draggedIndex = null;
    }
  }

  publish() {
    this.router.navigate(['/article/preview'], {
      state: {
        title: this.title,
        contentList: this.contentList,
      },
    });
  }
}
