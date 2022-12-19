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
        style="width: 155px"
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
        v-for="ceil in INVENTORY"
        :key="ceil.id"
        @dragover.prevent
        @dragenter.prevent
        @drop="onCeilDrop($event, ceil)"
        @click="onCeilClick($event, ceil)"
      >
        <div
          class="inventory-grid__content"
          v-if="ceil.item"
          draggable="true"
          @dragstart="onCeilDragStart($event, ceil)"
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
      <InventoryModal
        :isModalOpen="isModalOpen"
        :getImage="getImage"
        @onCloseModal="onCloseModal"
      />
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
import InventoryModal from "./InventoryModal.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "AppInventory",
  components: {
    InventoryModal,
  },
  data() {
    return {
      grid: {
        cols: 5,
        rows: 5,
      },
      isModalOpen: false,
    };
  },
  created() {
    // generate inventory grid
    const ceils = [];

    for (let y = 0; y < this.grid.rows; y++) {
      for (let x = 0; x < this.grid.cols; x++) {
        ceils.push({
          id: uid(),
          position: {
            x: x + 1,
            y: y + 1,
          },
        });
      }
    }

    this.setInventory(ceils);
    this.getInventoryData();
  },
  computed: {
    ...mapGetters(["INVENTORY", "ACTIVE_CEIL"]),
  },
  methods: {
    ...mapMutations(["setActiveCeil", "setInventory", "setInventoryItem"]),
    ...mapActions(["getInventoryData", "buildInventory"]),
    onCeilDragStart(e, item) {
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("id", item.id);
    },
    onCeilDrop(e, item) {
      const draggedId = e.dataTransfer.getData("id");
      const droppedId = item.id;

      const ceilIndexFrom = this.INVENTORY.findIndex(
        (el) => el.id === draggedId
      );
      const ceilIndexTo = this.INVENTORY.findIndex((el) => el.id === droppedId);

      const isCeilFree = !this.INVENTORY[ceilIndexTo].item;

      if (draggedId === droppedId || !isCeilFree) return;

      const toData = {
        ...this.INVENTORY[ceilIndexTo],
        item: this.INVENTORY[ceilIndexFrom].item,
      };

      this.setInventoryItem({
        index: ceilIndexTo,
        data: toData,
      });

      const fromData = { ...this.INVENTORY[ceilIndexFrom] };
      delete fromData.item;

      this.setInventoryItem({
        index: ceilIndexFrom,
        data: fromData,
      });

      if (this.INVENTORY[ceilIndexFrom].id == this.ACTIVE_CEIL.id) {
        this.setActiveCeil(this.INVENTORY[ceilIndexTo]);
      }
    },
    onCeilClick(e, ceil) {
      if (ceil.item) {
        this.setActiveCeil(ceil);
        this.isModalOpen = true;
      } else {
        this.isModalOpen = false;
      }
    },
    onCloseModal() {
      this.isModalOpen = false;
    },
    getImage(imgName) {
      return require("@/assets/img/" + imgName);
    },
  },
};
</script>
