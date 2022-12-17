<template>
  <div class="inventory">
    <div class="inventory-info">
      <div class="inventory-info__img">
        <img
          src="@/assets/img/img-blur.png"
          width="208"
          height="240"
          alt="main"
        />
      </div>
      <div
        class="inventory__skeleton inventory__skeleton--2"
        style="width: 155px; margin-bottom: 24px"
      ></div>
      <div class="inventory__skeleton" style="width: 155px"></div>
      <div class="inventory__skeleton" style="width: 190px"></div>
      <div class="inventory__skeleton" style="width: 170px"></div>
      <div class="inventory__skeleton" style="width: 160px"></div>
      <div class="inventory__skeleton" style="width: 140px"></div>
      <div class="inventory__skeleton" style="width: 80px"></div>
    </div>
    <div class="inventory-grid">
      <div
        class="inventory-grid__cell"
        v-for="ceil in inventory"
        :key="ceil.id"
        @dragover.prevent
        @dragenter.prevent
        @drop="onDrop($event, ceil)"
      >
        <div
          class="inventory-grid__content"
          v-if="ceil.item"
          draggable="true"
          @dragstart="onDragStart($event, ceil)"
        >
          <div class="inventory-grid__img">
            <img
              :src="getImage(ceil.item.imageSrc)"
              :alt="ceil.item.name"
              draggable="false"
              width="54"
              height="54"
            />
          </div>
          <div class="inventory-grid__count">
            {{ ceil.item.count }}
          </div>
        </div>
      </div>
    </div>
    <div class="inventory-footer">
      <div class="inventory__skeleton inventory__skeleton--3"></div>
      <div class="inventory-footer__close">
        <img
          src="@/assets/img/close-icon.svg"
          width="12"
          height="12"
          alt="close"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { uid } from "uid";

export default {
  name: "AppInventory",
  props: {
    inventoryItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      grid: {
        cols: 5,
        rows: 5,
      },
      inventory: [],
      isInventoryLoad: false,
    };
  },
  created() {
    // generate grid
    for (let y = 0; y < this.grid.rows; y++) {
      for (let x = 0; x < this.grid.cols; x++) {
        this.inventory.push({
          id: uid(),
          position: {
            x: x + 1,
            y: y + 1,
          },
        });
      }
    }
    this.loadInventory();
  },
  watch: {
    inventoryItems: {
      handler() {
        this.loadInventory();
      },
      deep: true,
    },
  },
  methods: {
    loadInventory() {
      if (this.inventoryItems.length > 0) {
        this.inventoryItems.forEach((itemCeil) => {
          const index = this.inventory.findIndex((inventoryCeil) => {
            return (
              inventoryCeil.position.x === itemCeil.position.x &&
              inventoryCeil.position.y === itemCeil.position.y
            );
          });
          this.inventory[index].item = itemCeil.item;
        });
        this.isInventoryLoad = true;
      }
    },
    onDragStart(e, item) {
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("id", item.id);
    },
    onDrop(e, item) {
      const draggedId = e.dataTransfer.getData("id");
      const droppedId = item.id;

      const ceilIndexFrom = this.inventory.findIndex(
        (el) => el.id === draggedId
      );
      const ceilIndexTo = this.inventory.findIndex((el) => el.id === droppedId);

      const isCeilFree = !this.inventory[ceilIndexTo].item;

      if (draggedId === droppedId || !isCeilFree) return;

      this.inventory[ceilIndexTo].item = this.inventory[ceilIndexFrom].item;
      delete this.inventory[ceilIndexFrom].item;
    },
    itemInCell(col, row) {
      return this.inventoryItems.find(
        (item) => item.position.x === col && item.position.y === row
      );
    },
    getImage(imgName) {
      return require("@/assets/img/" + imgName);
    },
  },
};
</script>

<style lang="scss">
.inventory {
  display: grid;
  grid-template-columns: 236px auto;
  gap: 24px;
  color: rgba(#fff, 0.4);
  padding: 32px;

  &__skeleton {
    margin: 0 auto 16px;
    background: linear-gradient(
      90deg,
      #3c3c3c 0%,
      #444444 51.04%,
      #333333 100%
    );
    border-radius: 8px;
    height: 10px;

    &--2 {
      border-radius: 8px;
      height: 26px;
    }

    &--3 {
      border-radius: 12px;
      height: 36px;
      margin: 0;
    }
  }
}

.inventory-info {
  background: #262626;
  border: 1px solid #4d4d4d;
  border-radius: 12px;
  padding: 18px 14px;
  &__img {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(6px);
    border-radius: 8px;
    margin-bottom: 20px;

    img {
      display: flex;
      border-radius: 8px;
    }
  }
}

.inventory-grid {
  border: none;
  border-radius: 0;
  display: flex;
  flex-wrap: wrap;

  &__row {
    display: flex;

    &:first-child {
      .inventory-grid__cell {
        &:first-child {
          border-top-left-radius: 12px;
        }
        &:last-child {
          border-top-right-radius: 12px;
        }
      }
    }
    &:last-child {
      .inventory-grid__cell {
        &:first-child {
          border-bottom-left-radius: 12px;
        }
        &:last-child {
          border-bottom-right-radius: 12px;
        }
      }
    }
  }

  &__cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 105px;
    height: 100px;
    padding: 12px;
    background: #262626;
    box-shadow: 0 0 2px #4d4d4d;
    position: relative;

    img {
      width: 54px;
      height: 54px;
    }
  }

  &__count {
    position: absolute;
    bottom: 0;
    right: 0;
    font-family: "Inter", sans-serif;
    font-weight: 500;
    font-size: 10px;
    line-height: 12px;
    padding: 2px 4px;
    background: #262626;
    border-top: 1px solid #4d4d4d;
    border-left: 1px solid #4d4d4d;
    border-radius: 6px 0px 0px 0px;
  }
}

.inventory-footer {
  position: relative;
  padding: 18px;
  grid-column: span 2;
  padding-right: 68px;
  background: #262626;
  border: 1px solid #4d4d4d;
  border-radius: 12px;

  &__close {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 12px;
    height: 12px;
  }
}
</style>
