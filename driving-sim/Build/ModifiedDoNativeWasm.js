window.addEventListener('load', function ()
{
	// Check if the original function exists
	if (typeof doNativeWasm === 'function')
	{
		// Store a reference to the original function if needed
		const originalDoNativeWasm = doNativeWasm;

		// Override the function
		doNativeWasm = function (global, env, providedBuffer)
		{
			console.log('Custom doNativeWasm logic');
			if (typeof WebAssembly !== "object")
			{
				abort("No WebAssembly support found. Build with -s WASM=0 to target JavaScript instead.");
				err("no native wasm support detected");
				return false;
			}
			if (!(Module["wasmMemory"] instanceof WebAssembly.Memory))
			{
				err("no native wasm Memory in use");
				return false;
			}
			env["memory"] = Module["wasmMemory"];
			info["global"] = {
				"NaN": NaN,
				"Infinity": Infinity
			};
			info["global.Math"] = Math;
			info["env"] = env;

			function receiveInstance(instance, module)
			{
				exports = instance.exports;
				if (exports.memory) mergeMemory(exports.memory);
				Module["asm"] = exports;
				Module["usingWasm"] = true;
				removeRunDependency("wasm-instantiate");
			}

			addRunDependency("wasm-instantiate");

			if (Module["instantiateWasm"])
			{
				try
				{
					return Module["instantiateWasm"](info, receiveInstance);
				}
				catch (e)
				{
					err("Module.instantiateWasm callback failed with error: " + e);
					return false;
				}
			}

			var trueModule = Module;

			function receiveInstantiatedSource(output)
			{
				assert(Module === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
				trueModule = null;
				receiveInstance(output["instance"], output["module"]);
			}

			function instantiateArrayBuffer(receiver)
			{
				getBinaryPromise().then(function (binary)
				{
					return WebAssembly.instantiate(binary, info);
				}).then(receiver).catch(function (reason)
				{
					err("failed to asynchronously prepare wasm: " + reason);
					abort(reason);
				});
			}

			// Replace WebAssembly.instantiateStreaming with ArrayBuffer instantiation
			if (!Module["wasmBinary"] && typeof fetch === "function")
			{
				// Fetch the wasm file and instantiate it from ArrayBuffer
				fetch(wasmBinaryFile,
					{
						credentials: "same-origin"
					})
					.then(function (response)
					{
						return response.arrayBuffer();
					})
					.then(function (buffer)
					{
						return WebAssembly.instantiate(buffer, info);
					})
					.then(receiveInstantiatedSource)
					.catch(function (reason)
					{
						err("wasm instantiation failed: " + reason);
						abort(reason);
					});
			}
			else
			{
				instantiateArrayBuffer(receiveInstantiatedSource);
			}

			return {};
			
			// Optionally, call the original function if needed
            // return originalDoNativeWasm(global, env, providedBuffer);
		};
	}
	else
	{
		console.error('doNativeWasm function not found.');
	}
});