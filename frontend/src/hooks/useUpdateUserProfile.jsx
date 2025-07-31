import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateUserProfile = () => {
	const queryClient = useQueryClient();

	const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: async (formData) => {
			// Debug log
			console.log("🛠️ Sending form data to server:", formData);

			// Validate fullName before sending
			if (!formData.fullName || formData.fullName.trim().length === 0) {
				throw new Error("Full name is required");
			}

			const res = await fetch(`/api/users/update`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			let data;
			try {
				data = await res.json();
			} catch (e) {
				throw new Error("Invalid JSON response from server");
			}

			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}

			return data;
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
				queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
			]);
		},
		onError: (error) => {
			console.error("❌ Error updating profile:", error.message);
			toast.error(error.message || "Failed to update profile");
		},
	});

	return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
