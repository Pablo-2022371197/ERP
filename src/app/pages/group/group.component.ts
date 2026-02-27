import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-group',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        BadgeModule,
        ChipModule,
        TagModule,
        ProgressBarModule,
        ButtonModule
    ],
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.css']
})
export class GroupComponent {
    totalGroups = 42;

    groups = [
        {
            name: 'Development Team',
            members: 12,
            progress: 85,
            status: 'active',
            projects: 5
        },
        {
            name: 'Design Team',
            members: 8,
            progress: 72,
            status: 'active',
            projects: 3
        },
        {
            name: 'Marketing Team',
            members: 15,
            progress: 60,
            status: 'pending',
            projects: 7
        },
        {
            name: 'QA Team',
            members: 6,
            progress: 90,
            status: 'active',
            projects: 4
        }
    ];
}
