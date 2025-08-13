import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { QROptions, GradientOptions } from '../../core/models/qr';

@Component({
  selector: 'app-style-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatCheckboxModule,
    MatTabsModule,
    MatIconModule
  ],
  templateUrl: './style-editor.component.html',
  styleUrls: ['./style-editor.component.scss']
})
export class StyleEditorComponent implements OnInit {
  @Input() value: QROptions = {};
  @Output() valueChange = new EventEmitter<QROptions>();

  // Default values
  defaultOptions: QROptions = {
    color: '#000000',
    bgColor: '#ffffff',
    width: 256,
    errorCorrection: 'M',
    dotStyle: 'square',
    eyeShape: 'square',
    quietZone: 0,
    roundedCorners: 0
  };

  ngOnInit(): void {
    // Ensure default values
    this.value = { ...this.defaultOptions, ...this.value };
    this.valueChange.emit(this.value);
  }

  update<K extends keyof QROptions>(key: K, val: QROptions[K]): void {
    this.value = { ...this.value, [key]: val };
    this.valueChange.emit(this.value);
  }

  updateGradient<K extends keyof GradientOptions>(key: K, val: GradientOptions[K]): void {
    const gradient = { ...(this.value.gradient || {}), [key]: val };
    this.update('gradient', gradient);
  }

  clearGradient(): void {
    this.update('gradient', undefined);
  }

  resetToDefaults(): void {
    this.value = { ...this.defaultOptions };
    this.valueChange.emit(this.value);
  }

  getPresetColors(): string[] {
    return [
      '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
      '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
      '#808080', '#ffc0cb', '#a52a2a', '#008000', '#000080'
    ];
  }

  applyPresetColor(color: string, type: 'color' | 'bgColor'): void {
    this.update(type, color);
  }

  formatLabel(value: number): string {
    return `${value}`;
  }
}