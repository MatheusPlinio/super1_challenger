<script lang="ts">
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let error = '';

	const handleLogin = async () => {
		error = '';

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			if (!res.ok) {
				throw new Error('Invalid credentials');
			}

			const data = await res.json();
			goto('/');
		} catch (err: any) {
			error = err.message;
		}
	};
</script>

<div class="max-w-md mx-auto mt-16 p-6 border rounded shadow">
	<h1 class="text-2xl font-bold mb-4">Login</h1>

	{#if error}
		<p class="text-red-600 mb-4">{error}</p>
	{/if}

	<form on:submit|preventDefault={handleLogin} class="flex flex-col gap-4">
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
		<button type="submit" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
			Login
		</button>
	</form>

	<p class="mt-4 text-sm">
		Don't have an account?
		<a href="/auth/register" class="text-blue-600 hover:underline">Register</a>
	</p>
</div>
