<template>
  <Transition name="slide-left">
    <div class="inventory-modal" v-show="isModalOpen">
      <div class="inventory-modal__img">
        <img
          :src="getImage(ACTIVE_CEIL.item.imageSrc)"
          :alt="ACTIVE_CEIL.item.name"
          width="130"
          height="130"
        />
      </div>
      <div class="inventory-modal__body">
        <div class="inventory__skeleton inventory__skeleton--2"></div>
        <div class="inventory__skeleton"></div>
        <div class="inventory__skeleton"></div>
        <div class="inventory__skeleton"></div>
        <div class="inventory__skeleton" style="width: 180px"></div>
        <div class="inventory__skeleton" style="width: 80px"></div>
      </div>
      <div class="inventory-modal__footer">
        <button
          class="inventory-modal__btn btn btn--primary"
          type="button"
          @click="onDeleteClick"
        >
          Удалить предмет
        </button>
      </div>
      <Transition
        name="slide-up"
        @after-enter="isDeleteConfirmAnimated = true"
        @before-leave="isDeleteConfirmAnimated = false"
      >
        <div
          class="inventory-modal__delete"
          :class="{ animated: isDeleteConfirmAnimated }"
          v-show="isDeleteConfirm"
        >
          <div class="inventory-modal__count">
            <input
              type="number"
              placeholder="Введите количество"
              v-model="deleteCount"
            />
          </div>
          <div class="inventory-modal__buttons">
            <button
              class="inventory-modal__btn btn btn--white btn--sm"
              type="button"
              @click="isDeleteConfirm = false"
            >
              Отмена
            </button>
            <button
              class="inventory-modal__btn btn btn--primary btn--sm"
              type="button"
              @click="onDeleteConfirmClick"
            >
              Подтвердить
            </button>
          </div>
        </div>
      </Transition>
      <div class="inventory-modal__close" @click="closeModal">
        <img
          src="@/assets/img/close-icon.svg"
          width="12"
          height="12"
          alt="close"
        />
      </div>
    </div>
  </Transition>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "InventoryModal",
  props: {
    isModalOpen: {
      type: Boolean,
      default: false,
    },
    getImage: {
      type: Function,
    },
  },
  data() {
    return {
      isDeleteConfirm: false,
      isDeleteConfirmAnimated: false,
      deleteCount: 0,
    };
  },
  computed: {
    ...mapGetters(["ACTIVE_CEIL", "INVENTORY"]),
  },
  methods: {
    ...mapMutations(["setInventoryItem"]),
    onDeleteClick() {
      this.isDeleteConfirm = true;
    },
    onDeleteConfirmClick() {
      const currentIndex = this.INVENTORY.findIndex(
        (item) => item.id == this.ACTIVE_CEIL.id
      );

      if (currentIndex === -1) return;

      const currentCeil = this.INVENTORY[currentIndex];
      const currentValue = currentCeil.item.count;

      const itemData = { ...currentCeil };

      if (this.deleteCount >= currentValue) {
        delete itemData.item;
      } else {
        itemData.item.count = currentValue - this.deleteCount;
      }
      this.setInventoryItem({ index: currentIndex, data: itemData });

      this.closeModal();
    },
    closeModal() {
      this.$emit("onCloseModal");
      this.isDeleteConfirm = false;
    },
  },
};
</script>

<style></style>
