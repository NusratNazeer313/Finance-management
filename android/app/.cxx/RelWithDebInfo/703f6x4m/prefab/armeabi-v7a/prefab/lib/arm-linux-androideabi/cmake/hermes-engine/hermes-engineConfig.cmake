if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/private/var/folders/c7/r6_s_1712jb69n7p6ypf19sw0000gn/T/cursor-sandbox-cache/91c25fe7968b9d56c9cc3b2b9ef80121/gradle/caches/9.3.1/transforms/88b7305a7dcfdc8d5ef6c5edd95347a6/transformed/hermes-android-250829098.0.14-release/prefab/modules/hermesvm/libs/android.armeabi-v7a/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/private/var/folders/c7/r6_s_1712jb69n7p6ypf19sw0000gn/T/cursor-sandbox-cache/91c25fe7968b9d56c9cc3b2b9ef80121/gradle/caches/9.3.1/transforms/88b7305a7dcfdc8d5ef6c5edd95347a6/transformed/hermes-android-250829098.0.14-release/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

