<template>
    <div class="container">
        <h2 class="mb-4">{{ isEdit ? 'Edit Code' : 'Create New Code' }}</h2>
        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label for="code" class="form-label">Code</label>
                <input type="text" class="form-control" id="code" v-model="form.code" required />
            </div>
            <div class="mb-3">
                <label for="percent" class="form-label">Percent</label>
                <input type="number" class="form-control" id="percent" v-model="form.percent" min="1" max="99"
                    required />
            </div>
            <div class="mb-3">
                <label for="start" class="form-label">Start Date</label>
                <input type="date" class="form-control" id="start" v-model="form.start" required />
            </div>
            <div class="mb-3">
                <label for="end" class="form-label">End Date</label>
                <input type="date" class="form-control" id="end" v-model="form.end" required />
            </div>
            <div class="mb-3">
                <label for="state" class="form-label">State</label>
                <select class="form-select" id="state" v-model="form.state" required>
                    <option value="enable">Enable</option>
                    <option value="disable">Disable</option>
                </select>
            </div>
            <div class="d-flex justify-content-center">
                <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update' : 'Submit' }}</button>
            </div>
        </form>
    </div>
</template>

<script>
import CodedService from '@/services/coded.service';
import LocalStorageHelper from '@/services/local.service';

export default {
    props: {
        editData: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            form: {
                userid: LocalStorageHelper.getItem("id"),
                code: '',
                percent: null,
                start: '',
                end: '',
                state: 'enable',
            },
            isEdit: false,
        };
    },
    watch: {
        editData: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.form = {
                        ...newVal,
                        start: newVal.start.split('T')[0],
                        end: newVal.end.split('T')[0], 
                    };
                    this.isEdit = true;
                } else {
                    this.resetForm();
                    this.isEdit = false;
                }
            },
        },
    },
    methods: {
        async handleSubmit() {
            if (this.validateForm()) {
                try {
                    const data = {
                        ...this.form,
                        start: new Date(this.form.start).toISOString(),
                        end: new Date(this.form.end).toISOString(),
                    };
                    data.userid = LocalStorageHelper.getItem("id");
                    if (this.isEdit) {
                        await CodedService.update(data._id, data);
                        alert('Data updated successfully!');
                    } else {
                        await CodedService.create(data);
                        alert('Data saved successfully!');
                    }
                    this.$emit('data-saved');
                } catch (error) {
                    console.error('Error saving data:', error);
                    alert('Failed to save data.');
                }
            }
        },
        validateForm() {
            const { percent, start, end } = this.form;
            if (percent <= 0 || percent >= 100) {
                alert('Percent must be between 1 and 99.');
                return false;
            }
            if (new Date(end) <= new Date(start)) {
                alert('End date must be after start date.');
                return false;
            }
            return true;
        },
        resetForm() {
            this.form = {
                userid: LocalStorageHelper.getItem("id"),
                code: '',
                percent: null,
                start: '',
                end: '',
                state: 'enable',
            };
        },
    },
};
</script>

<style scoped>
/* Add your styles here */
</style>