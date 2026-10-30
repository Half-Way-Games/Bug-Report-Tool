import { Component } from '@angular/core';
import {CollapsibleCard} from '../../components/collapsible-card/collapsible-card';
import {JsonValueComponent} from '../../components/json-value-component/json-value-component';
import {JsonValue} from '../../models/bug-report';

@Component({
  imports: [
    CollapsibleCard,
    JsonValueComponent
  ],
  selector: 'app-bugs-detail',
  styleUrl: './bugs-detail.css',
  templateUrl: './bugs-detail.html',
})
export class BugsDetail {
  constructor() {
    console.log('BugsDetail constructor called');
  }

  bug = {
    "id": 9,
    "received_at": "2026-03-09T05:05:01.000Z",
    "build_version": "0.2.132",
    "summary": "\u003E **Game Bug Report**\n\u003E\n\u003E **Issue:** Pressing and holding both attack and block simultaneously locks the character in place, even after releasing the buttons. The lock can be resolved by changing the character's state to any other action.\n\u003E\n\u003E **Details:**\n\u003E - **Build Version:** 0.2.132\n\u003E - **Platform:** Linux 42 (Adams)\n\u003E - **Hardware:** AMD Ryzen 9 7900X, AMD Radeon RX 6700 XT, 32GB RAM\n\u003E\n\u003E **Key Data:**\n\u003E - `PlayerActionController`: `is_movement_locked` is true.\n\u003E - `PlayerAnimationController`: `current_animation` is \"Secondary Weapon/Guard To Standing\".\n\u003E - `PlayerStateMachine`: `current_state` is \"Grounded\".\n\u003E\n\u003E **Repro Steps:**\n\u003E 1. Press and hold both attack and block.\n\u003E 2. Observe the block animation play.\n\u003E 3. Release both buttons.\n\u003E 4. Character remains locked.\n\u003E\n\u003E **Notes:**\n\u003E - Issue occurs consistently.\n\u003E - Character can be unlocked by changing to any other state.",
    "reporter_note": "Attacking & Blocking at the same time locks up the character. Press and hold both, you'll see the block animation play, then release both. You'll be locked in place. Can be reset by changing to any other state.",
    "screenshot_path": "2026-03-09/0846da36-827a-4d0c-a3c3-f991cb880f31.jpg",
    "raw_payload": {
      "received_at": "2026-03-09 00:05:01",
      "build_version": "0.2.132",
      "reporter_note": "Attacking & Blocking at the same time locks up the character. Press and hold both, you'll see the block animation play, then release both. You'll be locked in place. Can be reset by changing to any other state.",
      "platform": "Linux 42 (Adams)",
      "hardware_stats": {
        "cpu": "AMD Ryzen 9 7900X 12-Core Processor",
        "display": {
          "refresh": 359.839996337891,
          "size": "(2560, 1440)"
        },
        "gpu": "AMD Radeon RX 6700 XT (RADV NAVI22)",
        "ram": {
          "free": 7.58237457275391,
          "total": 30.4771308898926
        }
      },
      "screenshot_path": "2026-03-09/0846da36-827a-4d0c-a3c3-f991cb880f31.jpg",
      "data": {
        "PlayerActionController": {
          "action_phase": "Committed",
          "attack_sequence": 0,
          "can_chain": false,
          "current_category": "Attack",
          "is_action_active": false,
          "is_guarding": false,
          "is_movement_locked": true,
          "is_root_motion_active": true
        },
        "PlayerAnimationController": {
          "action_override_active": false,
          "airborne_state": "Start",
          "base_layer_state": "Locomotion",
          "climbs_state": "Start",
          "current_animation": "Secondary Weapon/Guard To Standing",
          "offhand_action_state": "End",
          "primary_action_state": "LightAttack1",
          "queued_base_state": null,
          "upper_body_state": "Idle"
        },
        "PlayerInputManager": {
          "controller_sensitivity": 1,
          "input_history": [],
          "mouse_sensitivity": 0.25
        },
        "PlayerManager": {
          "character_stats": {
            "Cunning": 10,
            "Dexterity": 9,
            "Endurance": 16,
            "Intelligence": 8,
            "Strength": 11,
            "Vigor": 15,
            "Wisdom": 8
          },
          "global_position": "(6.961457, 0.003088, 1.189104)",
          "is_grounded": true,
          "velocity": "(0.0, 0.0, 0.0)"
        },
        "PlayerResourcesManager": {
          "health": 225,
          "is_regenerating_stamina": false,
          "max_health": 225,
          "max_stamina": 160,
          "stamina": 160
        },
        "PlayerStateMachine": {
          "current_state": "Grounded"
        }
      }
    },
    "platform": "Linux 42 (Adams)",
    "hardware_stats": {
      "cpu": "AMD Ryzen 9 7900X 12-Core Processor",
      "display": {
        "refresh": 359.839996337891,
        "size": "(2560, 1440)"
      },
      "gpu": "AMD Radeon RX 6700 XT (RADV NAVI22)",
      "ram": {
        "free": 7.58237457275391,
        "total": 30.4771308898926
      }
    }
  };

  get diagnosticEntries(): [string, JsonValue][] {
    return Object.entries(this.bug.raw_payload.data);
  }

  get rawPayloadJson(): string {
    return JSON.stringify(this.bug.raw_payload.data, null, 2);
  }
}
