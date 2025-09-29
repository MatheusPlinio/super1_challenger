<script lang="ts">
	import { goto } from '$app/navigation';

	let name = '';
	let email = '';
	let password = '';
	let error = '';

	const handleRegister = async () => {
		error = '';

		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password })
			});

			if (!res.ok) {
				throw new Error('Failed to register');
			}

			const data = await res.json();
			goto('/auth/login');
		} catch (err: any) {
			error = err.message;
		}
	};
</script>

<div class="max-w-md mx-auto mt-16 p-6 border rounded shadow">
	<h1 class="text-2xl font-bold mb-4">Register</h1>

	{#if error}
		<p class="text-red-600 mb-4">{error}</p>
	{/if}

	<form on:submit|preventDefault={handleRegister} class="flex flex-col gap-4">
		<input type="text" placeholder="Name" bind:value={name} class="border rounded p-2" required />
		<input
			type="email"
			placeholder="Email"
			bind:value={email}
			class="border rounded p-2"
			required
		/>
		<input
			type="password"
			placeholder="Password"
			bind:value={password}
			class="border rounded p-2"
			required
		/>
		<button type="submit" class="bg-green-600 text-white p-2 rounded hover:bg-green-700">
			Register
		</button>
	</form>

	<p class="mt-4 text-sm">
		Already have an account?
		<a href="/auth/login" class="text-blue-600 hover:underline">Login</a>
	</p>
</div>
