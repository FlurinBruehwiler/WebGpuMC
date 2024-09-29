﻿using System;
using System.Collections.Generic;
using System.Runtime.InteropServices.JavaScript;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace WasmTestCSharp.WebGPU;

public partial class Interop
{
    //GPURenderPassEncoder
    [JSImport("GPURenderPassEncoder.end", "main.js")]
    public static partial void GPURenderPassEncoder_End(JSObject renderPassEncoder);

    [JSImport("GPURenderPassEncoder.draw", "main.js")]
    public static partial void GPURenderPassEncoder_Draw(JSObject renderPassEncoder, int vertexCount);

    [JSImport("GPURenderPassEncoder.setBindGroup", "main.js")]
    public static partial void GPURenderPassEncoder_SetBindGroup(JSObject renderPassEncoder, int slot, JSObject bindGroup);

    [JSImport("GPURenderPassEncoder.setVertexBuffer", "main.js")]
    public static partial void GPURenderPassEncoder_SetVertexBuffer(JSObject renderPassEncoder, int slot, JSObject buffer);

    [JSImport("GPURenderPassEncoder.setPipeline", "main.js")]
    public static partial void GPURenderPassEncoder_SetPipeline(JSObject renderPassEncoder, JSObject renderPipeline);


    //GPUBuffer
    [JSImport("GPUBuffer.destroy", "main.js")]
    public static partial void GPUBuffer_Destroy(JSObject gpuBuffer);


    //GPUTexture
    [JSImport("GPUTexture.createView", "main.js")]
    public static partial JSObject GPUTexture_CreateView(JSObject gpuTexture);


    //GPUQueue
    [JSImport("GPUQueue.writeBuffer", "main.js")]
    public static partial void GPUQueue_WriteBuffer(JSObject gpuQueue, JSObject buffer, int bufferOffset, float[] data, int dataOffset, int size);

    [JSImport("GPUQueue.submit", "main.js")]
    public static partial void GPUQueue_Submit(JSObject gpuQueue, JSObject[] commandBuffers);


    //GPUDevice
    [JSImport("GPUDevice.createCommandEncoder", "main.js")]
    public static partial JSObject GPUDevice_CreateCommandEncoder(JSObject gpuDevice);

    [JSImport("GPUDevice.createBuffer", "main.js")]
    public static partial JSObject GPUDevice_CreateBuffer(JSObject gpuDevice, string json, JSObject[] references);

    [JSImport("GPUDevice.createRenderPipeline", "main.js")]
    public static partial JSObject GPUDevice_CreateRenderPipeline(JSObject gpuDevice, string json, JSObject[] references);

    [JSImport("GPUDevice.createBindGroup", "main.js")]
    public static partial JSObject GPUDevice_CreateBindGroup(JSObject gpuDevice, string json, JSObject[] references);

    [JSImport("GPUDevice.createShaderModule", "main.js")]
    public static partial JSObject GPUDevice_CreateShaderModule(JSObject gpuDevice, string json, JSObject[] references);

    //GPUCommandEncoder
    [JSImport("GPUCommandEncoder.beginRenderPass", "main.js")]
    public static partial JSObject GPUCommandEncoder_BeginRenderPass(JSObject gpuCommandEncoder, string json, JSObject[] references);

    [JSImport("GPUCommandEncoder.finish", "main.js")]
    public static partial JSObject GPUCommandEncoder_Finish(JSObject gpuCommandEncoder);

    //GPUCanvas
    [JSImport("GPUCanvasContext.getCurrentTexture", "main.js")]
    public static partial JSObject GPUCanvasContext_GetCurrentTexture(JSObject gpuCanvasContext);

    [JSImport("GPUCanvasContext.configure", "main.js")]
    public static partial void GPUCanvasContext_Configure(JSObject gpuCanvasContext, string json, JSObject[] references);

    //GPURenderPipeline
    [JSImport("GPURenderPipeline.getBindGroupLayout", "main.js")]
    public static partial JSObject GPURenderPipeline_GetBindGroupLayout(JSObject gpuRenderPipeline, int index);

    //GPU
    [JSImport("GPU.getPreferredCanvasFormat", "main.js")]
    public static partial string GPU_GetPreferredCanvasFormat();

    [JSImport("GPU.requestAdapter", "main.js")]
    public static partial Task<JSObject> GPU_RequestAdapter();

    //GPUAdapter
    [JSImport("GPUAdapter.requestDevice", "main.js")]
    public static partial Task<JSObject> GPUAdapter_requestDevice(JSObject gpuAdapter);

    //Canvas
    [JSImport("Canvas.getContext", "main.js")]
    public static partial JSObject Canvas_GetContext(JSObject canvas, string contextId);

    //Document
    [JSImport("Document.querSelector", "main.js")]
    public static partial JSObject Document_QuerySelector(string selector);
}

public static class InteropHelper
{
    public static (string str, JSObject[] references) MarshalComplexObject<T>(T complexObject)
    {
        var referenceManager = new ReferenceManager();
        var options = new JsonSerializerOptions
        {
            Converters = { new InteropObjectConverter(referenceManager) },
            TypeInfoResolver = InteropSerializerContext.Default
        };

        var json = JsonSerializer.Serialize(complexObject, options);

        return (json, referenceManager.GetReferences());
    }
}

[JsonSerializable(typeof(CreateBufferDescriptor))]
public partial class InteropSerializerContext : JsonSerializerContext;

public class ReferenceManager
{
    private readonly List<JSObject> _objects = [];

    public int GetReferenceIndex(IInteropObject interopObject)
    {
        var idx = _objects.IndexOf(interopObject.JsObject);
        if (idx != -1)
            return idx;

        _objects.Add(interopObject.JsObject);

        return _objects.Count - 1;
    }

    public JSObject[] GetReferences()
    {
        return _objects.ToArray();
    }
}

public class InteropObjectConverter(ReferenceManager referenceManager) : JsonConverter<IInteropObject>
{
    public override IInteropObject Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, IInteropObject value, JsonSerializerOptions options)
    {
        writer.WriteStringValue($"JSObject_Reference_{referenceManager.GetReferenceIndex(value)}");
    }
}
